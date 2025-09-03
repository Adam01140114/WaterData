# 🌊 Water Level Logger

A modern, responsive web application for logging and monitoring water levels at multiple water sites with interactive charts and data management.

## ✨ Features

- **5 Water Sites**: Log water levels for Site A, B, C, D, and E
- **Data Entry Form**: Easy-to-use form with site selection, water level input, timestamp, and notes
- **Interactive Charts**: Beautiful line charts showing water level trends over time
- **Data Management**: View, edit, and delete entries in a sortable table
- **Export Functionality**: Download your data as CSV files
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Local Storage**: Data is saved locally in your browser

## 🚀 Getting Started

1. **Open the Website**: Simply open `index.html` in your web browser
2. **Start Logging**: Use the form to log water levels for your sites
3. **View Trends**: Check the interactive charts to see water level patterns
4. **Manage Data**: Use the table to view, edit, or delete entries

## 📊 How to Use

### Logging Water Levels
1. Select a water site from the dropdown
2. Enter the water level in centimeters
3. Set the date and time (auto-filled with current time)
4. Add optional notes about conditions or observations
5. Click "Log Water Level" to save

### Viewing Charts
- **Site Selection**: Choose to view all sites or focus on a specific one
- **Time Range**: Filter data by last 7, 30, or 90 days, or view all time
- **Interactive**: Hover over data points to see exact values

### Managing Data
- **Table View**: See all entries sorted by date (newest first)
- **Edit Entries**: Click the edit button to modify existing data
- **Delete Entries**: Remove unwanted entries with confirmation
- **Export Data**: Download your data as a CSV file for external analysis

## 🛠️ Technical Details

- **Frontend**: Pure HTML, CSS, and JavaScript
- **Charts**: Chart.js library for beautiful data visualization
- **Storage**: Browser localStorage for data persistence
- **Responsive**: CSS Grid and Flexbox for modern layouts
- **No Dependencies**: Works offline and doesn't require internet connection

## 📱 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🔧 Customization

### Adding More Sites
To add more water sites, edit the `script.js` file and update the site options in the HTML form.

### Changing Units
Modify the labels and input fields to use different units (inches, meters, etc.).

### Styling
Customize colors, fonts, and layout by editing `styles.css`.

## 📈 Data Structure

Each water level entry contains:
- **Site**: The water site identifier
- **Water Level**: Numeric value in centimeters
- **Timestamp**: Date and time of the reading
- **Notes**: Optional text observations
- **ID**: Unique identifier for data management

## 💾 Data Export

The export feature creates CSV files with:
- Site name
- Water level (cm)
- Date and time
- Notes

## 🚨 Important Notes

- **Data Storage**: All data is stored locally in your browser
- **Browser Clearing**: Clearing browser data will remove your water level records
- **Backup**: Use the export feature to backup your data regularly
- **Sample Data**: The app includes sample data for demonstration (can be removed)

## 🎯 Use Cases

- **Environmental Monitoring**: Track water levels in lakes, rivers, or ponds
- **Agricultural Planning**: Monitor irrigation water sources
- **Research Projects**: Collect data for scientific studies
- **Personal Monitoring**: Keep track of water features on your property

## 🔮 Future Enhancements

Potential improvements could include:
- Database integration for permanent storage
- User authentication and multiple user support
- Alert systems for critical water levels
- Mobile app version
- API integration with weather data
- Advanced analytics and predictions

## 📞 Support

This is a standalone application that runs entirely in your browser. For questions or issues, check the browser's developer console for any error messages.

---

**Enjoy monitoring your water levels! 🌊📊**
