// Water Level Logger Application
class WaterLevelLogger {
    constructor() {
        this.data = [];
        this.chart = null;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setCurrentDateTime();
        
        // Load data from Firebase
        this.data = await this.loadData();
        
        this.renderDataTable();
        this.createChart();
        this.showMessage('Welcome to Water Level Logger! Start by logging your first water level reading.', 'success');
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('waterLevelForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });

        // Chart controls
        document.getElementById('chartSiteSelect').addEventListener('change', () => {
            this.updateChart();
        });

        document.getElementById('timeRange').addEventListener('change', () => {
            this.updateChart();
        });

        // Table controls
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('clearDataBtn').addEventListener('click', () => {
            this.clearAllData();
        });
    }

    setCurrentDateTime() {
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        document.getElementById('timestamp').value = localDateTime;
    }

    handleFormSubmission() {
        const formData = {
            site: document.getElementById('siteSelect').value,
            waterLevel: parseFloat(document.getElementById('waterLevel').value),
            timestamp: document.getElementById('timestamp').value,
            notes: document.getElementById('notes').value,
            id: Date.now()
        };

        if (!formData.site || !formData.waterLevel || !formData.timestamp) {
            this.showMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Check for existing entry in the same month
        const existingEntry = this.checkMonthlyDuplicate(formData.site, formData.timestamp);
        
        if (existingEntry) {
            const shouldOverwrite = confirm(
                `A water level for ${formData.site} has already been recorded this month (${existingEntry.waterLevel} cm on ${new Date(existingEntry.timestamp).toLocaleDateString()}).\n\nDo you want to overwrite it with the new reading (${formData.waterLevel} cm) or cancel?`
            );
            
            if (shouldOverwrite) {
                // Remove the old entry
                this.data = this.data.filter(item => item.id !== existingEntry.id);
                this.addWaterLevel(formData);
                this.resetForm();
                this.showMessage('Water level updated successfully!', 'success');
            } else {
                this.showMessage('Entry cancelled.', 'error');
            }
        } else {
            this.addWaterLevel(formData);
            this.resetForm();
            this.showMessage('Water level logged successfully!', 'success');
        }
    }

    async addWaterLevel(data) {
        try {
            if (window.db && window.firebaseMethods) {
                const { collection, addDoc } = window.firebaseMethods;
                const docRef = await addDoc(collection(window.db, 'waterLevels'), data);
                data.id = docRef.id; // Use Firebase document ID
                this.data.push(data);
            } else {
                // Fallback to localStorage
                data.id = Date.now();
                this.data.push(data);
                localStorage.setItem('waterLevelData', JSON.stringify(this.data));
            }
            
            this.renderDataTable();
            this.updateChart();
        } catch (error) {
            console.error('Error adding water level:', error);
            this.showMessage('Error saving water level. Please try again.', 'error');
        }
    }

    checkMonthlyDuplicate(site, timestamp) {
        const newDate = new Date(timestamp);
        const newMonth = newDate.getMonth();
        const newYear = newDate.getFullYear();
        
        return this.data.find(entry => {
            if (entry.site === site) {
                const entryDate = new Date(entry.timestamp);
                return entryDate.getMonth() === newMonth && entryDate.getFullYear() === newYear;
            }
            return false;
        });
    }

    resetForm() {
        document.getElementById('waterLevelForm').reset();
        this.setCurrentDateTime();
    }

    renderDataTable() {
        const tbody = document.getElementById('dataTableBody');
        tbody.innerHTML = '';

        if (this.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #666;">No data available</td></tr>';
            return;
        }

        // Sort data by timestamp (newest first)
        const sortedData = [...this.data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        sortedData.forEach(entry => {
            const row = document.createElement('tr');
            row.className = 'fade-in';
            
            const timestamp = new Date(entry.timestamp);
            const formattedDate = timestamp.toLocaleDateString();
            const formattedTime = timestamp.toLocaleTimeString();

            row.innerHTML = `
                <td><strong>${entry.site}</strong></td>
                <td>${entry.waterLevel} cm</td>
                <td>${formattedDate}<br><small>${formattedTime}</small></td>
                <td>${entry.notes || '-'}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="waterLogger.editEntry(${entry.id})">Edit</button>
                    <button class="action-btn delete-btn" onclick="waterLogger.deleteEntry(${entry.id})">Delete</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    editEntry(id) {
        const entry = this.data.find(item => item.id === id);
        if (!entry) return;

        // Populate form with entry data
        document.getElementById('siteSelect').value = entry.site;
        document.getElementById('waterLevel').value = entry.waterLevel;
        document.getElementById('timestamp').value = entry.timestamp;
        document.getElementById('notes').value = entry.notes || '';

        // Remove old entry and update form submission
        this.data = this.data.filter(item => item.id !== id);
        this.saveData();
        this.renderDataTable();
        this.updateChart();

        // Change button text
        const submitBtn = document.querySelector('#waterLevelForm button[type="submit"]');
        submitBtn.textContent = 'Update Entry';
        submitBtn.dataset.editing = 'true';
    }

    async deleteEntry(id) {
        if (confirm('Are you sure you want to delete this entry?')) {
            try {
                if (window.db && window.firebaseMethods) {
                    const { doc, deleteDoc } = window.firebaseMethods;
                    await deleteDoc(doc(window.db, 'waterLevels', id));
                }
                
                this.data = this.data.filter(item => item.id !== id);
                
                // Update localStorage as backup
                localStorage.setItem('waterLevelData', JSON.stringify(this.data));
                
                this.renderDataTable();
                this.updateChart();
                this.showMessage('Entry deleted successfully.', 'success');
            } catch (error) {
                console.error('Error deleting entry:', error);
                this.showMessage('Error deleting entry. Please try again.', 'error');
            }
        }
    }

    createChart() {
        const ctx = document.getElementById('waterLevelChart').getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Water Level Trends Over Time',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            displayFormats: {
                                day: 'MMM d, yyyy',
                                month: 'MMM yyyy'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        },
                        ticks: {
                            source: 'auto',
                            maxRotation: 45,
                            minRotation: 0,
                            maxTicksLimit: 10
                        },
                        min: undefined,
                        max: undefined
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Water Level (cm)'
                        },
                        beginAtZero: true
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });

        // Chart is ready, no automatic sample data
        
        this.updateChart();
    }

    updateChart() {
        if (!this.chart) return;

        const selectedSite = document.getElementById('chartSiteSelect').value;
        const timeRange = document.getElementById('timeRange').value;
        const noDataMessage = document.getElementById('noDataMessage');
        const chartCanvas = document.getElementById('waterLevelChart');
        
        let filteredData = [...this.data];
        
        // Filter by time range
        if (timeRange !== 'all') {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange));
            filteredData = filteredData.filter(entry => new Date(entry.timestamp) >= cutoffDate);
        }

        // Filter by site
        if (selectedSite !== 'all') {
            filteredData = filteredData.filter(entry => entry.site === selectedSite);
        }

        // Sort by timestamp
        filteredData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // Debug logging
        console.log('Filtered data:', filteredData);
        console.log('Selected site:', selectedSite);
        console.log('Time range:', timeRange);

        // Show/hide no data message
        if (filteredData.length === 0) {
            noDataMessage.style.display = 'block';
            chartCanvas.style.display = 'none';
            return;
        } else {
            noDataMessage.style.display = 'none';
            chartCanvas.style.display = 'block';
        }

        // Force X-axis to show dates even with single data point
        if (filteredData.length === 1) {
            const singleDate = new Date(filteredData[0].timestamp);
            const dayBefore = new Date(singleDate);
            dayBefore.setDate(dayBefore.getDate() - 1);
            const dayAfter = new Date(singleDate);
            dayAfter.setDate(dayAfter.getDate() + 1);
            
            this.chart.options.scales.x.min = dayBefore;
            this.chart.options.scales.x.max = dayAfter;
        } else {
            this.chart.options.scales.x.min = undefined;
            this.chart.options.scales.x.max = undefined;
        }

        if (selectedSite === 'all') {
            // Show all sites with different colors
            const sites = [...new Set(filteredData.map(entry => entry.site))];
            const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
            
            this.chart.data.datasets = sites.map((site, index) => {
                const siteData = filteredData
                    .filter(entry => entry.site === site)
                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                    .map(entry => ({
                        x: new Date(entry.timestamp),
                        y: entry.waterLevel
                    }));
                
                return {
                    label: site,
                    data: siteData,
                    borderColor: colors[index % colors.length],
                    backgroundColor: colors[index % colors.length] + '20',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.1,
                    pointRadius: 6,
                    pointHoverRadius: 8
                };
            });
        } else {
            // Show single site
            const siteData = filteredData
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                .map(entry => ({
                    x: new Date(entry.timestamp),
                    y: entry.waterLevel
                }));
            
            this.chart.data.datasets = [{
                label: selectedSite,
                data: siteData,
                borderColor: '#3498db',
                backgroundColor: '#3498db20',
                borderWidth: 3,
                fill: false,
                tension: 0.1,
                pointRadius: 6,
                pointHoverRadius: 8
            }];
        }

        this.chart.update();
    }

    exportData() {
        if (this.data.length === 0) {
            this.showMessage('No data to export.', 'error');
            return;
        }

        const csvContent = this.convertToCSV(this.data);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `water_levels_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    convertToCSV(data) {
        const headers = ['Site', 'Water Level (cm)', 'Date & Time', 'Notes'];
        const csvRows = [headers.join(',')];
        
        data.forEach(entry => {
            const row = [
                entry.site,
                entry.waterLevel,
                entry.timestamp,
                entry.notes || ''
            ].map(field => `"${field}"`).join(',');
            csvRows.push(row);
        });
        
        return csvRows.join('\n');
    }

    async clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            try {
                if (window.db && window.firebaseMethods) {
                    const { collection, getDocs, doc, deleteDoc } = window.firebaseMethods;
                    const querySnapshot = await getDocs(collection(window.db, 'waterLevels'));
                    
                    // Delete all documents
                    const deletePromises = [];
                    querySnapshot.forEach((docSnapshot) => {
                        deletePromises.push(deleteDoc(doc(window.db, 'waterLevels', docSnapshot.id)));
                    });
                    
                    await Promise.all(deletePromises);
                }
                
                this.data = [];
                localStorage.removeItem('waterLevelData');
                
                this.renderDataTable();
                this.updateChart();
                this.showMessage('All data has been cleared.', 'success');
            } catch (error) {
                console.error('Error clearing data:', error);
                this.showMessage('Error clearing data. Please try again.', 'error');
            }
        }
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;

        // Insert message after header
        const header = document.querySelector('header');
        header.parentNode.insertBefore(messageDiv, header.nextSibling);

        // Auto-remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    async loadData() {
        try {
            if (!window.db) {
                console.log('Firebase not ready, using localStorage fallback');
                const saved = localStorage.getItem('waterLevelData');
                return saved ? JSON.parse(saved) : [];
            }

            const { collection, getDocs } = window.firebaseMethods;
            const querySnapshot = await getDocs(collection(window.db, 'waterLevels'));
            const data = [];
            
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() });
            });
            
            // Sort by timestamp (newest first)
            return data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } catch (error) {
            console.error('Error loading data from Firebase:', error);
            // Fallback to localStorage
            const saved = localStorage.getItem('waterLevelData');
            return saved ? JSON.parse(saved) : [];
        }
    }

    async saveData() {
        try {
            if (!window.db) {
                console.log('Firebase not ready, using localStorage fallback');
                localStorage.setItem('waterLevelData', JSON.stringify(this.data));
                return;
            }

            // For Firebase, we don't need to save all data at once
            // Individual operations (add, update, delete) handle the database
            console.log('Data operations handled individually in Firebase');
        } catch (error) {
            console.error('Error saving data to Firebase:', error);
            // Fallback to localStorage
            localStorage.setItem('waterLevelData', JSON.stringify(this.data));
        }
    }

    addSampleData() {
        if (this.data.length === 0) {
            const sampleData = [
                {
                    site: 'Site A',
                    waterLevel: 45.2,
                    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                    notes: 'Sample reading',
                    id: Date.now() - 7 * 24 * 60 * 60 * 1000
                },
                {
                    site: 'Site B',
                    waterLevel: 32.8,
                    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                    notes: 'Sample reading',
                    id: Date.now() - 6 * 24 * 60 * 60 * 1000
                },
                {
                    site: 'Site C',
                    waterLevel: 28.5,
                    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                    notes: 'Sample reading',
                    id: Date.now() - 5 * 24 * 60 * 60 * 1000
                }
            ];
            
            sampleData.forEach(data => this.addWaterLevel(data));
            this.showMessage('Sample data added for demonstration!', 'success');
        }
    }
}

// Initialize the application when the page loads
let waterLogger;
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for Firebase to initialize
    setTimeout(() => {
        waterLogger = new WaterLevelLogger();
    }, 1000);
});

// Add sample data button (for demonstration purposes)
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (waterLogger && waterLogger.data.length === 0) {
            const sampleBtn = document.createElement('button');
            sampleBtn.textContent = 'Add Sample Data';
            sampleBtn.className = 'btn-secondary';
            sampleBtn.style.marginTop = '10px';
            sampleBtn.onclick = () => waterLogger.addSampleData();
            
            const dataEntrySection = document.querySelector('.data-entry');
            dataEntrySection.appendChild(sampleBtn);
        }
    }, 1000);
});
