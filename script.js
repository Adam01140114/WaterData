// ===== Firebase Configuration =====
    const firebaseConfig = {
      apiKey: "AIzaSyCgu5VzQcD0hPEpcslrizbiat_Q8VKPa3I",
      authDomain: "workout-b4051.firebaseapp.com",
      projectId: "workout-b4051",
      storageBucket: "workout-b4051.firebasestorage.app",
      messagingSenderId: "162149362879",
      appId: "1:162149362879:web:7db78878fa79bf9b4eea0a",
      measurementId: "G-6Y3WBWFE98"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

         // ===== Modal Management =====
    function liftModalsToBody() {
      const ids = [
        'authModal',
        'profileModal',
        'settingsModal',
        'addCaloriesModal',
        'weightLoggingModal',
        'addWeightModal',
        'mobileWorkoutModal',
        'mobileTreadmillModal',
        'mobileStairsModal',
        'mobileFoodModal',
        'mobileCustomFoodModal'
      ];
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.parentElement !== document.body) {
          document.body.appendChild(el);
        }
      });
    }

         // ===== Authentication State Management =====
     let currentUser = null;
     let userProfile = null;
     let authStateInitialized = false;

     auth.onAuthStateChanged(async (user) => {
       console.log('Auth state changed:', user ? 'User logged in' : 'No user');
       
       if (user) {
         currentUser = user;
         console.log('User signed in:', user.email);
         
         // Check if user has profile
         try {
           const profileDoc = await db.collection('users').doc(user.uid).get();
           if (profileDoc.exists) {
             userProfile = profileDoc.data();
             console.log('Profile found, showing app');
             showApp();
             loadUserData();
           } else {
             console.log('No profile found, showing profile setup');
             showProfileSetup();
           }
         } catch (error) {
           console.error('Error checking profile:', error);
           showAuthModal();
         }
       } else {
         currentUser = null;
         userProfile = null;
         console.log('No user, showing auth modal');
         // Ensure all modals are hidden first
         hideAllModals();
         showAuthModal();
       }
       
       // Mark auth state as initialized
       authStateInitialized = true;
     });

     // Show auth modal immediately for first-time users
     setTimeout(() => {
       console.log('Checking auth state - authStateInitialized:', authStateInitialized);
       if (!authStateInitialized) {
         console.log('Showing auth modal for first-time user');
         showAuthModal();
       }
     }, 100);

    // ===== UI State Management =====
         function hideAllModals() {
       console.log('Hiding all modals');
       document.getElementById('authModal').classList.add('hidden');
       document.getElementById('profileModal').classList.add('hidden');
       const settingsModal = document.getElementById('settingsModal');
       settingsModal.classList.add('hidden');
       const addCaloriesModal = document.getElementById('addCaloriesModal');
       addCaloriesModal.classList.add('hidden');
       const addWeightModal = document.getElementById('addWeightModal');
       addWeightModal.classList.add('hidden');
       const weightLoggingModal = document.getElementById('weightLoggingModal');
       weightLoggingModal.classList.add('hidden');
       
       // Hide mobile modals
       const mobileWorkoutModal = document.getElementById('mobileWorkoutModal');
       mobileWorkoutModal.classList.add('hidden');
       const mobileTreadmillModal = document.getElementById('mobileTreadmillModal');
       mobileTreadmillModal.classList.add('hidden');
       const mobileStairsModal = document.getElementById('mobileStairsModal');
       mobileStairsModal.classList.add('hidden');
       
       document.getElementById('appContent').classList.add('hidden');
     }

         function showAuthModal() {
       console.log('showAuthModal called');
       
       // Ensure all other modals are hidden first
       hideAllModals();
       
       const authModal = document.getElementById('authModal');
       authModal.classList.remove('hidden');
       authModal.style.zIndex = '2000';
       showSignupForm(); // Show signup form by default instead of login
     }

    function hideAuthModal() {
      document.getElementById('authModal').classList.add('hidden');
    }

         function showLoginForm() {
       document.getElementById('loginForm').classList.remove('hidden');
       document.getElementById('signupForm').classList.add('hidden');
     }

     function showSignupForm() {
       document.getElementById('loginForm').classList.add('hidden');
       document.getElementById('signupForm').classList.remove('hidden');
     }

    function showSignupForm() {
      document.getElementById('loginForm').classList.add('hidden');
      document.getElementById('signupForm').classList.remove('hidden');
    }

    function showProfileSetup() {
      // Only show profile setup if user is authenticated
      if (!currentUser) {
        console.log('Cannot show profile setup - no authenticated user');
        showAuthModal();
        return;
      }
      
      console.log('Showing profile setup for user:', currentUser.email);
      document.getElementById('authModal').classList.add('hidden');
      const profileModal = document.getElementById('profileModal');
      profileModal.classList.remove('hidden');
      document.getElementById('appContent').classList.add('hidden');
    }

    function hideProfileSetup() {
      document.getElementById('profileModal').classList.add('hidden');
    }

         function showApp() {
       document.getElementById('authModal').classList.add('hidden');
       document.getElementById('profileModal').classList.add('hidden');
       document.getElementById('appContent').classList.remove('hidden');
       
       // Enable settings buttons
       const desk = document.getElementById('openSettings');
       if (desk) desk.disabled = false;
       const mob = document.getElementById('mobileOpenSettings');
       if (mob) mob.disabled = false;  // it was left disabled in HTML
     }

     function showAddCaloriesModal() {
       // Set today's date as default
       const today = new Date().toISOString().split('T')[0];
       document.getElementById('caloriesDate').value = today;
       document.getElementById('caloriesAmount').value = '';
       
       // Clear any previous messages
       document.getElementById('addCaloriesError').classList.add('hidden');
       document.getElementById('addCaloriesSuccess').classList.add('hidden');
       
       const addCaloriesModal = document.getElementById('addCaloriesModal');
       addCaloriesModal.classList.remove('hidden');
       
       // Ensure modal is visible on mobile
       addCaloriesModal.style.zIndex = '2000';
     }

     function hideAddCaloriesModal() {
       const addCaloriesModal = document.getElementById('addCaloriesModal');
       addCaloriesModal.classList.add('hidden');
     }

    function showSettings() {
      // Only show settings if user is authenticated
      if (!currentUser || !userProfile) {
        console.log('User not authenticated or profile not loaded');
        return;
      }
      
      // Populate settings with current values
      document.getElementById('settingsAge').value = userProfile.age || '';
      document.getElementById('settingsHeightFt').value = userProfile.heightFt || '';
      document.getElementById('settingsHeightIn').value = userProfile.heightIn || '';
      document.getElementById('settingsWeight').value = userProfile.weight || '';
      document.getElementById('settingsTheme').value = currentTheme || 'dark';
      
      const settingsModal = document.getElementById('settingsModal');
      settingsModal.classList.remove('hidden');
    }

    function hideSettings() {
      const settingsModal = document.getElementById('settingsModal');
      settingsModal.classList.add('hidden');
    }

    // ===== Authentication Event Listeners =====
    document.getElementById('showSignup').addEventListener('click', showSignupForm);
    document.getElementById('showLogin').addEventListener('click', showLoginForm);


    document.getElementById('loginBtn').addEventListener('click', async () => {
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const errorDiv = document.getElementById('loginError');

      try {
        await auth.signInWithEmailAndPassword(email, password);
        errorDiv.classList.add('hidden');
      } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
      }
    });

    document.getElementById('signupBtn').addEventListener('click', async () => {
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const errorDiv = document.getElementById('signupError');

      if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match';
        errorDiv.classList.remove('hidden');
        return;
      }

      if (password.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters';
        errorDiv.classList.remove('hidden');
        return;
      }

      try {
        await auth.createUserWithEmailAndPassword(email, password);
        errorDiv.classList.add('hidden');
      } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
      }
    });

    // ===== Profile Setup =====
    document.getElementById('saveProfileBtn').addEventListener('click', async () => {
      const age = +document.getElementById('setupAge').value;
      const heightFt = +document.getElementById('setupHeightFt').value;
      const heightIn = +document.getElementById('setupHeightIn').value;
      const weight = +document.getElementById('setupWeight').value;
      const errorDiv = document.getElementById('profileError');

      if (!age || !heightFt || !weight) {
        errorDiv.textContent = 'Please fill in all fields';
        errorDiv.classList.remove('hidden');
        return;
      }

             try {
         const bmr = calcBMR(age, weight, heightFt, heightIn);
         userProfile = { age, heightFt, heightIn, weight, bmr };
         
         await db.collection('users').doc(currentUser.uid).set(userProfile);
         
         // Log initial weight for today
         const today = todayStr();
         weightByDate[today] = weight;
         await saveUserData();
         
         hideProfileSetup();
         showApp();
         loadUserData();
         errorDiv.classList.add('hidden');
       } catch (error) {
         errorDiv.textContent = error.message;
         errorDiv.classList.remove('hidden');
       }
    });

    // ===== Settings Management =====
    document.getElementById('openSettings').addEventListener('click', () => {
      // Double-check authentication before showing settings
      if (!currentUser || !userProfile) {
        console.log('Settings access denied - user not authenticated');
        return;
      }
      showSettings();
    });
    document.getElementById('cancelSettings').addEventListener('click', hideSettings);
    


    document.getElementById('saveSettings').addEventListener('click', async () => {
      // Check if user is authenticated
      if (!currentUser) {
        const errorDiv = document.getElementById('settingsError');
        errorDiv.textContent = 'Please log in to save settings';
        errorDiv.classList.remove('hidden');
        return;
      }

      const age = +document.getElementById('settingsAge').value;
      const heightFt = +document.getElementById('settingsHeightFt').value;
      const heightIn = +document.getElementById('settingsHeightIn').value;
      const weight = +document.getElementById('settingsWeight').value;
      const theme = document.getElementById('settingsTheme').value;
      const errorDiv = document.getElementById('settingsError');
      const successDiv = document.getElementById('settingsSuccess');

      if (!age || !heightFt || !weight) {
        errorDiv.textContent = 'Please fill in all fields';
        errorDiv.classList.remove('hidden');
        successDiv.classList.add('hidden');
        return;
      }

      try {
        const bmr = calcBMR(age, weight, heightFt, heightIn);
        userProfile = { ...userProfile, age, heightFt, heightIn, weight, bmr };
        currentTheme = theme;
        
        await db.collection('users').doc(currentUser.uid).update(userProfile);
        
                 // Update BMR calculation
         renderBMR(age, weight, heightFt, heightIn);
         
         // Apply theme
         applyTheme(theme);
        
        errorDiv.classList.add('hidden');
        successDiv.textContent = 'Settings saved successfully!';
        successDiv.classList.remove('hidden');
        
        setTimeout(() => {
          successDiv.classList.add('hidden');
          hideSettings();
        }, 2000);
      } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
        successDiv.classList.add('hidden');
      }
    });

         // ===== Logout =====
     document.getElementById('logoutBtn').addEventListener('click', () => {
       auth.signOut();
     });

     // ===== Delete Account =====
     document.getElementById('deleteAccountBtn').addEventListener('click', async () => {
       if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
         try {
           await db.collection('users').doc(currentUser.uid).delete();
           await currentUser.delete();
           auth.signOut();
         } catch (error) {
           console.error('Error deleting account:', error);
           alert('Error deleting account. Please try again.');
         }
       }
     });

     // ===== Weight Logging Modal Event Listeners =====
     document.getElementById('submitDailyWeight').addEventListener('click', async () => {
       const weight = Number(document.getElementById('dailyWeight').value);
       const errorDiv = document.getElementById('weightLoggingError');
       
       if (!weight || weight <= 0) {
         errorDiv.textContent = 'Please enter a valid weight';
         errorDiv.classList.remove('hidden');
         return;
       }
       
       try {
         const today = todayStr();
         
         // Update user profile with new weight
         if (userProfile) {
           userProfile.weight = weight;
           userProfile.bmr = calcBMR(userProfile.age, weight, userProfile.heightFt, userProfile.heightIn);
           
           // Save updated profile to Firebase
           await db.collection('users').doc(currentUser.uid).update(userProfile);
           
                    // Update BMR calculation for today
         renderBMR(userProfile.age, weight, userProfile.heightFt, userProfile.heightIn);
         
         // Update settings modal if it's open
         const settingsWeightInput = document.getElementById('settingsWeight');
         if (settingsWeightInput) {
           settingsWeightInput.value = weight;
         }
         }
         
         // Add weight to tracking data
         addWeightForDate(weight, today);
         hideWeightLoggingModal();
         errorDiv.classList.add('hidden');
       } catch (error) {
         errorDiv.textContent = error.message;
         errorDiv.classList.remove('hidden');
       }
     });

     document.getElementById('maybeLaterWeight').addEventListener('click', () => {
       hideWeightLoggingModal();
     });

     document.getElementById('closeWeightModal').addEventListener('click', () => {
       const today = todayStr();
       weightLoggingClosed[today] = true;
       saveUserData();
       hideWeightLoggingModal();
     });

     // ===== Add Weight Modal Event Listeners =====
     document.getElementById('addWeightBtn').addEventListener('click', showAddWeightModal);
     document.getElementById('cancelAddWeight').addEventListener('click', hideAddWeightModal);
     document.getElementById('submitAddWeight').addEventListener('click', async () => {
       const weight = Number(document.getElementById('weightAmount').value);
       const date = document.getElementById('weightDate').value;
       const errorDiv = document.getElementById('addWeightError');
       const successDiv = document.getElementById('addWeightSuccess');
       
       if (!weight || !date) {
         errorDiv.textContent = 'Please fill in all fields';
         errorDiv.classList.remove('hidden');
         successDiv.classList.add('hidden');
         return;
       }
       
       if (weight <= 0) {
         errorDiv.textContent = 'Please enter a valid weight';
         errorDiv.classList.remove('hidden');
         successDiv.classList.add('hidden');
         return;
       }
       
       try {
         addWeightForDate(weight, date);
         
         // If this is today's weight, update the user profile
         const today = todayStr();
         if (date === today && userProfile) {
           userProfile.weight = weight;
           userProfile.bmr = calcBMR(userProfile.age, weight, userProfile.heightFt, userProfile.heightIn);
           
           // Save updated profile to Firebase
           await db.collection('users').doc(currentUser.uid).update(userProfile);
           
           // Update BMR calculation for today
           renderBMR(userProfile.age, weight, userProfile.heightFt, userProfile.heightIn);
           
           // Update settings modal if it's open
           const settingsWeightInput = document.getElementById('settingsWeight');
           if (settingsWeightInput) {
             settingsWeightInput.value = weight;
           }
         }
         
         errorDiv.classList.add('hidden');
         successDiv.textContent = 'Weight logged successfully!';
         successDiv.classList.remove('hidden');
         
         setTimeout(() => {
           hideAddWeightModal();
         }, 1500);
       } catch (error) {
         errorDiv.textContent = error.message;
         errorDiv.classList.remove('hidden');
         successDiv.classList.add('hidden');
       }
     });

    // ===== Data Management =====
         async function loadUserData() {
       if (!currentUser) return;

       try {
         // Load user's progress data
         const progressDoc = await db.collection('users').doc(currentUser.uid).collection('progress').doc('data').get();
         if (progressDoc.exists) {
           const data = progressDoc.data();
           console.log('Loading user data from Firebase:', data);
           
           basalByDate = data.basalByDate || {};
           activityByDate = data.activityByDate || {};
           weightByDate = data.weightByDate || {};
           workoutDataByDate = data.workoutDataByDate || {};
           foodDataByDate = data.foodDataByDate || {};
           customFoods = data.customFoods || {};
           weightLoggingClosed = data.weightLoggingClosed || {};
           currentTheme = data.currentTheme || 'dark';
           
           console.log('Loaded workoutDataByDate:', workoutDataByDate);
           
           // Load streak data if it exists
           if (data.streakData) {
             streakData = { ...streakData, ...data.streakData };
             // Convert workoutDates back to Set if it exists
             if (data.streakData.workoutDates) {
               streakData.workoutDates = new Set(data.streakData.workoutDates);
             }
           }
           
           // Recalculate streaks after loading data to ensure accuracy
           console.log('About to recalculate streaks...');
           calculateStreaks();
           console.log('Streaks calculated, updating display...');
           updateStreakDisplay();
           
           updateCharts();
         }

                  // Calculate and display BMR from user profile
         if (userProfile) {
           renderBMR(userProfile.age, userProfile.weight, userProfile.heightFt, userProfile.heightIn);
         }

         // Load workout charts with saved data
         loadTreadmillChart();
         loadStairsChart();

         // Update food menu with custom foods
         updateFoodMenu();
         
         // Apply current theme
         applyTheme(currentTheme);

         // Check for daily weight logging only if user has a profile
         if (userProfile) {
           checkDailyWeightLogging();
         }
       } catch (error) {
         console.error('Error loading user data:', error);
       }
     }

         async function saveUserData() {
       if (!currentUser) return;

       try {
         // Convert Set to Array for Firebase storage
         const streakDataForStorage = {
           ...streakData,
           workoutDates: Array.from(streakData.workoutDates)
         };
         
         await db.collection('users').doc(currentUser.uid).collection('progress').doc('data').set({
           basalByDate,
           activityByDate,
           weightByDate,
           workoutDataByDate,
           foodDataByDate,
           customFoods,
           weightLoggingClosed,
           currentTheme,
           streakData: streakDataForStorage,
           lastUpdated: new Date()
         });
       } catch (error) {
         console.error('Error saving user data:', error);
       }
     }

         // ===== Helper Functions =====
     function todayStr(){return new Date().toISOString().split('T')[0];}
     
     // ===== Streak Functions =====
     function calculateStreaks() {
       const today = todayStr();
       console.log('calculateStreaks called, workoutDataByDate:', workoutDataByDate);
       
       const workoutDates = Object.keys(workoutDataByDate).filter(date => {
         const day = workoutDataByDate[date];
         const hasTreadmill = day.treadmill && day.treadmill.calories > 0;
         const hasStairs = day.stairs && day.stairs.calories > 0;
         console.log(`Date ${date}: treadmill=${hasTreadmill}, stairs=${hasStairs}`);
         return hasTreadmill || hasStairs;
       }).sort();
       
       console.log('Filtered workout dates:', workoutDates);
       
       if (workoutDates.length === 0) {
         streakData.currentStreak = 0;
         streakData.bestStreak = 0;
         streakData.totalWorkouts = 0;
         streakData.lastWorkoutDate = null;
         streakData.workoutDates = new Set();
         return;
       }
       
       // Calculate total workouts
       streakData.totalWorkouts = workoutDates.length;
       streakData.lastWorkoutDate = workoutDates[workoutDates.length - 1];
       streakData.workoutDates = new Set(workoutDates);
       
       // Calculate current streak
       let currentStreak = 0;
       let currentDate = new Date(today);
       
       // Check if user worked out today
       if (workoutDates.includes(today)) {
         currentStreak = 1;
         currentDate.setDate(currentDate.getDate() - 1);
         
         // Count backwards to find consecutive days
         while (true) {
           const checkDate = currentDate.toISOString().split('T')[0];
           if (workoutDates.includes(checkDate)) {
             currentStreak++;
             currentDate.setDate(currentDate.getDate() - 1);
           } else {
             break;
           }
         }
       } else {
         // Check if user worked out yesterday
         const yesterday = new Date(today);
         yesterday.setDate(yesterday.getDate() - 1);
         const yesterdayStr = yesterday.toISOString().split('T')[0];
         
         if (workoutDates.includes(yesterdayStr)) {
           // Count backwards from yesterday
           currentStreak = 1;
           currentDate.setDate(currentDate.getDate() - 2);
           
           while (true) {
             const checkDate = currentDate.toISOString().split('T')[0];
             if (workoutDates.includes(checkDate)) {
               currentStreak++;
               currentDate.setDate(currentDate.getDate() - 1);
             } else {
               break;
             }
           }
         } else {
           currentStreak = 0;
         }
       }
       
       streakData.currentStreak = currentStreak;
       
       // Calculate best streak
       let bestStreak = 0;
       let tempStreak = 0;
       
       for (let i = 0; i < workoutDates.length; i++) {
         if (i === 0) {
           tempStreak = 1;
         } else {
           const prevDate = new Date(workoutDates[i - 1]);
           const currDate = new Date(workoutDates[i]);
           const diffDays = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));
           
           if (diffDays === 1) {
             tempStreak++;
           } else {
             bestStreak = Math.max(bestStreak, tempStreak);
             tempStreak = 1;
           }
         }
       }
       
       bestStreak = Math.max(bestStreak, tempStreak);
       streakData.bestStreak = bestStreak;
     }
     
     function updateStreakDisplay() {
       console.log('updateStreakDisplay called, streakData:', streakData);
       
       // Update mobile streak display
       const mobileStreakCount = document.getElementById('mobileStreakCount');
       const mobileBestStreak = document.getElementById('mobileBestStreak');
       const mobileTotalWorkouts = document.getElementById('mobileTotalWorkouts');
       const mobileStreakBar = document.getElementById('mobileStreakBar');
       
       console.log('Mobile elements found:', {
         mobileStreakCount: !!mobileStreakCount,
         mobileBestStreak: !!mobileBestStreak,
         mobileTotalWorkouts: !!mobileTotalWorkouts,
         mobileStreakBar: !!mobileStreakBar
       });
       
       if (mobileStreakCount) {
         console.log(`Setting mobile streak count to: ${streakData.currentStreak}`);
         mobileStreakCount.textContent = streakData.currentStreak;
         mobileBestStreak.textContent = streakData.bestStreak;
         mobileTotalWorkouts.textContent = streakData.totalWorkouts;
         
         // Update progress bar (max at 30 days for visual appeal)
         const progressPercent = Math.min((streakData.currentStreak / 30) * 100, 100);
         mobileStreakBar.style.width = progressPercent + '%';
       }
       
       // Update desktop streak display
       const desktopStreakCount = document.getElementById('desktopStreakCount');
       const desktopBestStreak = document.getElementById('desktopBestStreak');
       const desktopTotalWorkouts = document.getElementById('desktopTotalWorkouts');
       const desktopCurrentWeek = document.getElementById('desktopCurrentWeek');
       const desktopStreakBar = document.getElementById('desktopStreakBar');
       
       console.log('Desktop elements found:', {
         desktopStreakCount: !!desktopStreakCount,
         desktopBestStreak: !!desktopBestStreak,
         desktopTotalWorkouts: !!desktopTotalWorkouts,
         desktopCurrentWeek: !!desktopCurrentWeek,
         desktopStreakBar: !!desktopStreakBar
       });
       
       if (desktopStreakCount) {
         console.log(`Setting desktop streak count to: ${streakData.currentStreak}`);
         desktopStreakCount.textContent = streakData.currentStreak;
         desktopBestStreak.textContent = streakData.bestStreak;
         desktopTotalWorkouts.textContent = streakData.totalWorkouts;
         
         // Calculate workouts this week
         const today = new Date();
         const weekStart = new Date(today);
         weekStart.setDate(today.getDate() - today.getDay());
         const weekStartStr = weekStart.toISOString().split('T')[0];
         
         let weekWorkouts = 0;
         for (let i = 0; i < 7; i++) {
           const checkDate = new Date(weekStart);
           checkDate.setDate(weekStart.getDate() + i);
           const checkDateStr = checkDate.toISOString().split('T')[0];
           
           if (streakData.workoutDates.has(checkDateStr)) {
             weekWorkouts++;
           }
         }
         
         desktopCurrentWeek.textContent = weekWorkouts;
         
         // Update progress bar
         const progressPercent = Math.min((streakData.currentStreak / 30) * 100, 100);
         desktopStreakBar.style.width = progressPercent + '%';
       }
     }

     // ===== Weight Tracking Functions =====
     function checkDailyWeightLogging() {
       const today = todayStr();
       
       // Don't show if already logged or closed for today
       if (weightByDate[today] || weightLoggingClosed[today]) {
         return;
       }
       
       // Show weight logging modal
       showWeightLoggingModal();
     }

     function showWeightLoggingModal() {
       const weightLoggingModal = document.getElementById('weightLoggingModal');
       weightLoggingModal.classList.remove('hidden');
     }

     function hideWeightLoggingModal() {
       const weightLoggingModal = document.getElementById('weightLoggingModal');
       weightLoggingModal.classList.add('hidden');
     }

     function showAddWeightModal() {
       const today = new Date().toISOString().split('T')[0];
       document.getElementById('weightDate').value = today;
       document.getElementById('weightAmount').value = '';
       
       // Clear any previous messages
       document.getElementById('addWeightError').classList.add('hidden');
       document.getElementById('addWeightSuccess').classList.add('hidden');
       
       const addWeightModal = document.getElementById('addWeightModal');
       addWeightModal.classList.remove('hidden');
     }

     function hideAddWeightModal() {
       const addWeightModal = document.getElementById('addWeightModal');
       addWeightModal.classList.add('hidden');
     }

     function showMobileWorkoutMenu() {
       const mobileWorkoutModal = document.getElementById('mobileWorkoutModal');
       mobileWorkoutModal.classList.remove('hidden');
       mobileWorkoutModal.style.zIndex = '2000';
     }

     function hideMobileWorkoutMenu() {
       const mobileWorkoutModal = document.getElementById('mobileWorkoutModal');
       mobileWorkoutModal.classList.add('hidden');
     }

     function showMobileTreadmillModal() {
       const mobileTreadmillModal = document.getElementById('mobileTreadmillModal');
       mobileTreadmillModal.classList.remove('hidden');
       mobileTreadmillModal.style.zIndex = '2000';
       
       // Set default values
       document.getElementById('mobileTspeed').value = 3.5;
       document.getElementById('mobileTgrade').value = 7.5;
       document.getElementById('mobileTdur').value = 30;
       previewMobileTreadmill();
     }

     function hideMobileTreadmillModal() {
       const mobileTreadmillModal = document.getElementById('mobileTreadmillModal');
       mobileTreadmillModal.classList.add('hidden');
     }

     function showMobileStairsModal() {
       const mobileStairsModal = document.getElementById('mobileStairsModal');
       mobileStairsModal.classList.remove('hidden');
       mobileStairsModal.style.zIndex = '2000';
       
       // Set default values
       document.getElementById('mobileSdur').value = 20;
       document.getElementById('mobileSintensity').value = '8.8';
     }

     function hideMobileStairsModal() {
       const mobileStairsModal = document.getElementById('mobileStairsModal');
       mobileStairsModal.classList.add('hidden');
     }

     function showMobileFoodMenu() {
       const mobileFoodModal = document.getElementById('mobileFoodModal');
       mobileFoodModal.classList.remove('hidden');
       mobileFoodModal.style.zIndex = '2000';
     }

     function hideMobileFoodMenu() {
       const mobileFoodModal = document.getElementById('mobileFoodModal');
       mobileFoodModal.classList.add('hidden');
     }



     function showMobileCustomFoodModal(existingFood = null) {
       const mobileCustomFoodModal = document.getElementById('mobileCustomFoodModal');
       mobileCustomFoodModal.classList.remove('hidden');
       mobileCustomFoodModal.style.zIndex = '2000';
       
       if (existingFood) {
         // Editing existing food
         document.getElementById('mobileCustomFoodName').value = existingFood.name;
         document.getElementById('mobileCustomFoodCalories').value = existingFood.calories;
         document.getElementById('customFoodIcon').textContent = existingFood.icon;
         document.getElementById('mobileCustomFoodCalc').textContent = 'Add Food Calories';
         
         // Store the original food name for updating
         mobileCustomFoodModal.dataset.originalName = existingFood.name;
       } else {
         // Adding new food
         document.getElementById('mobileCustomFoodName').value = '';
         document.getElementById('mobileCustomFoodCalories').value = '';
         document.getElementById('customFoodIcon').textContent = '🍽️';
         document.getElementById('mobileCustomFoodCalc').textContent = 'Add Food';
         delete mobileCustomFoodModal.dataset.originalName;
       }
       document.getElementById('mobileCustomFoodResult').innerHTML = '';
     }

     function hideMobileCustomFoodModal() {
       const mobileCustomFoodModal = document.getElementById('mobileCustomFoodModal');
       mobileCustomFoodModal.classList.add('hidden');
     }

     function updateCustomFoodIcon() {
       const foodName = document.getElementById('mobileCustomFoodName').value;
       const icon = pickEmoji(foodName);
       document.getElementById('customFoodIcon').textContent = icon;
     }

     function updateFoodMenu() {
       const foodMenu = document.getElementById('mobileFoodModal');
       const menuGrid = foodMenu.querySelector('.menu-grid');
       
       // Check if user has any custom foods
       const customFoodsArray = Object.values(customFoods);
       
       if (customFoodsArray.length === 0) {
         // Show empty state message
         menuGrid.innerHTML = `
           <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--muted);">
             <div style="font-size: 48px; margin-bottom: 16px;">🍽️</div>
             <div style="font-size: 16px; margin-bottom: 8px;">You have no recorded food items</div>
             <div style="font-size: 14px;">Add some below!</div>
           </div>
         `;
       } else {
         // Show custom foods
         let menuHTML = '';
         customFoodsArray.forEach(food => {
           menuHTML += `
             <div class="menu-tile" id="mobileOpenCustom_${food.name.replace(/\s+/g, '_')}">
               <div class="menu-emoji">${food.icon}</div>
               <div>${food.name}</div>
             </div>
           `;
         });
         
         menuGrid.innerHTML = menuHTML;
         
         // Re-attach event listeners for custom foods
         customFoodsArray.forEach(food => {
           const elementId = `mobileOpenCustom_${food.name.replace(/\s+/g, '_')}`;
           const element = document.getElementById(elementId);
           if (element) {
             element.addEventListener('click', () => {
               hideMobileFoodMenu();
               showMobileCustomFoodModal(food);
             });
           }
         });
       }
     }



     function previewMobileTreadmill() {
       const w = userProfile?.weight || 170;
       const s = +document.getElementById('mobileTspeed').value;
       const g = +document.getElementById('mobileTgrade').value;
       const m = +document.getElementById('mobileTdur').value;
       
       if (w > 0 && s > 0 && g >= 0 && m > 0) {
         const total = calcTreadmillKcal(w, s, g, m);
         document.getElementById('mobileTresult').innerHTML = `<div class='math'>Preview ≈ ${Math.round(total)} kcal</div>`;
       } else {
         document.getElementById('mobileTresult').innerHTML = '';
       }
     }

     function addWeightForDate(weight, date) {
       weightByDate[date] = weight;
       console.log('Weight added for date:', date, 'weight:', weight);
       console.log('Current weightByDate:', weightByDate);
       updateCharts();
       saveUserData();
     }
    function mphToMmin(mph){return mph*26.8224}
    function calcTreadmillKcal(lbs,mph,gradePct,minutes){
      const kg=lbs/2.2046;const speed=mphToMmin(mph);const grade=gradePct/100;
      const vo2=0.1*speed+1.8*speed*grade+3.5;
      const kcalPerMin=(vo2*kg)/200;return kcalPerMin*minutes;
    }
    function calcStairKcal(lbs, minutes, met){
      const kg=lbs/2.2046;const kcalPerMin=(met*3.5*kg)/200;return kcalPerMin*minutes;
    }

         // ===== State =====
     let bmr=0;
     let basalByDate={};     // date -> BMR for that date
     let activityByDate={};  // date -> sum of activity kcal for that date
     let weightByDate={};    // date -> weight for that date
     let workoutDataByDate={}; // date -> workout data for that date
     let foodDataByDate={};  // date -> food data for that date
     let customFoods={};     // custom food name -> {name, calories, icon}
     let weightLoggingClosed={}; // date -> whether weight logging was closed for that date
     let currentTheme = 'dark'; // current theme setting
     
     // ===== Streak Tracking =====
     let streakData = {
       currentStreak: 0,
       bestStreak: 0,
       totalWorkouts: 0,
       lastWorkoutDate: null,
       workoutDates: new Set()
     };

         // ===== Theme Management =====
     function applyTheme(theme) {
       const root = document.documentElement;
       if (theme === 'light') {
         root.style.setProperty('--bg', '#ffffff');
         root.style.setProperty('--card', '#f8f9fa');
         root.style.setProperty('--muted', '#6c757d');
         root.style.setProperty('--text', '#212529');
       } else {
         root.style.setProperty('--bg', '#0b0f14');
         root.style.setProperty('--card', '#121821');
         root.style.setProperty('--muted', '#8aa0b4');
         root.style.setProperty('--text', '#e9f0f6');
       }
     }

    // ===== BMR =====
    function toKg(lbs){return lbs/2.2046}
    function toCm(ft,inch){return ft*30.48+inch*2.54}
    function calcBMR(age,lbs,ft,inch){
      const kg=toKg(lbs),cm=toCm(ft,inch);
      return 10*kg+6.25*cm-5*age+5;
    }
    function setBasalForToday(value){
      basalByDate[todayStr()]=Math.round(value);
      updateCharts();
      saveUserData();
    }
    function addActivityForToday(value){
      const d=todayStr();
      if(!activityByDate[d]) activityByDate[d]=0;
      activityByDate[d]+=Math.round(value);
      updateCharts();
      saveUserData();
    }
         function renderBMR(age,lbs,ft,inch){
       bmr=Math.round(calcBMR(age,lbs,ft,inch));
       setBasalForToday(bmr); // auto include BMR in daily total for the day
     }

         // BMR calculation is now handled automatically from user profile

         // ===== Charts =====
     let totalCtx=document.getElementById('totalChart').getContext('2d');
     let totalChart=new Chart(totalCtx,{
       type:'line',
       data:{labels:[],datasets:[
         {label:'Calorie Deficit',data:[],borderColor:'#6ee7b7',backgroundColor:'rgba(110,231,183,.3)',fill:true,tension:0.25}
       ]},
       options:{responsive:true,scales:{y:{beginAtZero:true,title:{display:true,text:'Calories'}}}}
     });

     // Mobile Charts
     let mobileTotalCtx=document.getElementById('mobileTotalChart').getContext('2d');
     let mobileTotalChart=new Chart(mobileTotalCtx,{
       type:'line',
       data:{labels:[],datasets:[
         {label:'Calorie Deficit',data:[],borderColor:'#6ee7b7',backgroundColor:'rgba(110,231,183,.3)',fill:true,tension:0.25}
       ]},
       options:{responsive:true,scales:{y:{beginAtZero:true,title:{display:true,text:'Calories'}}}}
     });

         let weightCtx=document.getElementById('weightChart').getContext('2d');
     let weightChart=new Chart(weightCtx,{
       type:'line',
       data:{labels:[],datasets:[
         {label:'Actual Weight',data:[],borderColor:'#6ee7b7',fill:false,tension:0.25},
         {label:'Projected Weight',data:[],borderColor:'#60a5fa',borderDash:[5,5],fill:false,tension:0.25}
       ]},
       options:{responsive:true,scales:{y:{beginAtZero:false}}}
     });

     let mobileWeightCtx=document.getElementById('mobileWeightChart').getContext('2d');
     let mobileWeightChart=new Chart(mobileWeightCtx,{
       type:'line',
       data:{labels:[],datasets:[
         {label:'Actual Weight',data:[],borderColor:'#6ee7b7',fill:false,tension:0.25},
         {label:'Projected Weight',data:[],borderColor:'#60a5fa',borderDash:[5,5],fill:false,tension:0.25}
       ]},
       options:{responsive:true,scales:{y:{beginAtZero:false}}}
     });

     let workoutCtx=document.getElementById('workoutChart').getContext('2d');
     let workoutChart=new Chart(workoutCtx,{
       type:'line',
       data:{labels:[],datasets:[
         {label:'Workout Calories',data:[],borderColor:'#6ee7b7',backgroundColor:'rgba(110,231,183,.3)',fill:true,tension:0.25}
       ]},
       options:{responsive:true,scales:{y:{beginAtZero:true,title:{display:true,text:'Calories'}}}}
     });

     let mobileWorkoutCtx=document.getElementById('mobileWorkoutChart').getContext('2d');
     let mobileWorkoutChart=new Chart(mobileWorkoutCtx,{
       type:'line',
       data:{labels:[],datasets:[
         {label:'Workout Calories',data:[],borderColor:'#6ee7b7',backgroundColor:'rgba(110,231,183,.3)',fill:true,tension:0.25}
       ]},
       options:{responsive:true,scales:{y:{beginAtZero:true,title:{display:true,text:'Calories'}}}}
     });

     // Mobile Food Chart
     let mobileFoodCtx=document.getElementById('mobileFoodChart').getContext('2d');
     let mobileFoodChart=new Chart(mobileFoodCtx,{
       type:'line',
       data:{labels:[],datasets:[
         {label:'Food Calories',data:[],borderColor:'#f59e0b',backgroundColor:'rgba(245,158,11,.3)',fill:true,tension:0.25}
       ]},
       options:{responsive:true,scales:{y:{beginAtZero:true,title:{display:true,text:'Calories'}}}}
     });

                  function getAllDates(){
           const set = new Set([
             ...Object.keys(basalByDate || {}),
             ...Object.keys(activityByDate || {}),
             ...Object.keys(foodDataByDate || {}),
             ...Object.keys(workoutDataByDate || {})
           ]);
           return Array.from(set).sort();
         }

         function computeFoodCaloriesForDate(d){
           const day = foodDataByDate?.[d] || {};
           let total = 0;
           for (const k of Object.keys(day)) {
             const item = day[k] || {};
             const qty = Number(item.quantity ?? 1);
             const fromTotal = Number(item.totalCalories);
             const fromParts = Number(item.calories) * qty;
             const add = !isNaN(fromTotal) ? fromTotal : (!isNaN(fromParts) ? fromParts : 0);
             total += add;
           }
           return Math.round(total);
         }

     // ===== Mobile Swipe Navigation =====
     let currentSlide = 0;
     const totalSlides = 5;
     let startX = 0;
     let currentX = 0;
     let isDragging = false;

     function showSlide(slideIndex) {
       // Hide all slides first
       for (let i = 0; i < totalSlides; i++) {
         const slide = document.getElementById(`mobile-slide-${i + 1}`);
         const indicator = document.querySelectorAll('.mobile-indicator')[i];
         
         slide.classList.remove('active', 'prev', 'next');
         slide.style.display = 'none';
         indicator.classList.remove('active');
       }

       // Show current slide
       const currentSlideElement = document.getElementById(`mobile-slide-${slideIndex + 1}`);
       const currentIndicator = document.querySelectorAll('.mobile-indicator')[slideIndex];
       
       currentSlideElement.style.display = 'flex';
       currentSlideElement.classList.add('active');
       currentIndicator.classList.add('active');

       // Set previous slide for swipe animation
       const prevIndex = slideIndex === 0 ? totalSlides - 1 : slideIndex - 1;
       const prevSlide = document.getElementById(`mobile-slide-${prevIndex + 1}`);
       prevSlide.style.display = 'flex';
       prevSlide.classList.add('prev');

       // Set next slide for swipe animation
       const nextIndex = slideIndex === totalSlides - 1 ? 0 : slideIndex + 1;
       const nextSlide = document.getElementById(`mobile-slide-${nextIndex + 1}`);
       nextSlide.style.display = 'flex';
       nextSlide.classList.add('next');
     }

     function nextSlide() {
       currentSlide = (currentSlide + 1) % totalSlides;
       showSlide(currentSlide);
     }

     function prevSlide() {
       currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
       showSlide(currentSlide);
     }

     // Touch event handlers
     let startY = 0;
     let isVerticalScroll = false;
     let hasMoved = false;

     function handleTouchStart(e) {
       // Don't start swipe detection if touching a button or interactive element
       if (e.target.tagName === 'BUTTON' || e.target.closest('button') || 
           e.target.tagName === 'INPUT' || e.target.closest('input') ||
           e.target.tagName === 'SELECT' || e.target.closest('select')) {
         return;
       }
       
       startX = e.touches[0].clientX;
       startY = e.touches[0].clientY;
       isDragging = true;
       isVerticalScroll = false;
       hasMoved = false;
     }

     function handleTouchMove(e) {
       if (!isDragging) return;
       
       currentX = e.touches[0].clientX;
       const currentY = e.touches[0].clientY;
       const diffX = startX - currentX;
       const diffY = startY - currentY;
       
       // Check if we've moved enough to consider it a gesture
       if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
         hasMoved = true;
       }
       
       // Determine if this is a vertical scroll or horizontal swipe
       if (!isVerticalScroll && Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 10) {
         isVerticalScroll = true;
         return; // Allow normal scrolling
       }
       
       // Only handle horizontal swipes
       if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
         e.preventDefault(); // Prevent scrolling during horizontal swipe
         
         // Add visual feedback only for significant swipes
         const activeSlide = document.querySelector('.mobile-slide.active');
         if (Math.abs(diffX) > 20) {
           activeSlide.style.transform = `translateX(${-diffX}px)`;
         }
       }
     }

     function handleTouchEnd(e) {
       if (!isDragging || isVerticalScroll || !hasMoved) {
         isDragging = false;
         isVerticalScroll = false;
         hasMoved = false;
         return;
       }
       
       isDragging = false;
       const diff = startX - currentX;
       const threshold = 80; // Increased threshold to prevent accidental swipes
       
       // Reset transform
       const activeSlide = document.querySelector('.mobile-slide.active');
       activeSlide.style.transform = '';
       
       if (Math.abs(diff) > threshold) {
         if (diff > 0) {
           // Swipe left - next slide
           nextSlide();
         } else {
           // Swipe right - previous slide
           prevSlide();
         }
       }
       
       hasMoved = false;
     }

     // Keyboard shortcut handler
     function handleKeyboardShortcuts(e) {
       // Ctrl+Shift to swipe left (next slide)
       if (e.ctrlKey && e.shiftKey) {
         e.preventDefault();
         nextSlide();
       }
     }

     // Initialize mobile swipe
     function initMobileSwipe() {
       const mobileContainer = document.querySelector('.mobile-container');
       if (mobileContainer) {
         mobileContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
         mobileContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
         mobileContainer.addEventListener('touchend', handleTouchEnd, { passive: false });
       }
       
       // Add keyboard event listener
       document.addEventListener('keydown', handleKeyboardShortcuts);
     }

         // Food icon mapping
         const FOOD_MAP = new Map([
           // drinks
           ["milk","🥛"], ["glass of milk","🥛"], ["oat milk","🥛"], ["soy milk","🥛"], ["milk tea","🧋"],
           ["water","💧"], ["juice","🧃"], ["apple juice","🧃"], ["orange juice","🧃"],
           ["soda","🥤"], ["cola","🥤"], ["soft drink","🥤"], ["milkshake","🥤"],
           ["coffee","☕"], ["latte","☕"], ["espresso","☕"], ["tea","🍵"], ["green tea","🍵"], ["teapot","🫖"],
           ["boba","🧋"], ["bubble tea","🧋"], ["smoothie","🥤"],
           ["beer","🍺"], ["beers","🍻"], ["wine","🍷"], ["champagne","🍾"], ["sake","🍶"], ["cocktail","🍸"], ["tropical drink","🍹"], ["mate","🧉"],

           // mains and fast food
           ["burger","🍔"], ["hamburger","🍔"], ["cheeseburger","🍔"],
           ["pizza","🍕"], ["slice","🍕"],
           ["hot dog","🌭"], ["hotdog","🌭"],
           ["taco","🌮"], ["burrito","🌯"], ["tamale","🫔"],
           ["sandwich","🥪"], ["wrap","🌯"], ["flatbread","🫓"],
           ["fries","🍟"], ["french fries","🍟"], ["pizza fries","🍟"],
           ["dumpling","🥟"], ["gyoza","🥟"], ["bao","🥟"], ["bento","🍱"], ["takeout","🥡"],
           ["sushi","🍣"], ["ramen","🍜"], ["noodles","🍜"], ["pho","🍜"], ["spaghetti","🍝"], ["pasta","🍝"],
           ["curry","🍛"], ["curry rice","🍛"], ["rice","🍚"], ["rice ball","🍙"], ["rice cracker","🍘"],
           ["soup","🍲"], ["stew","🍲"], ["bowl","🥣"], ["fondue","🫕"],
           ["bbq","🍖"], ["steak","🥩"], ["meat","🥩"], ["bacon","🥓"], ["chicken","🍗"], ["drumstick","🍗"], ["wings","🍗"],
           ["fried shrimp","🍤"], ["shrimp","🍤"], ["lobster","🦞"], ["crab","🦀"], ["oyster","🦪"], ["canned food","🥫"],
           ["egg","🥚"], ["omelet","🍳"], ["omelette","🍳"],
           ["salad","🥗"], ["taco salad","🥗"],

           // breads and breakfast
           ["bread","🍞"], ["baguette","🥖"], ["croissant","🥐"], ["bagel","🥯"], ["pancakes","🥞"], ["waffle","🧇"],

           // sweets
           ["donut","🍩"], ["doughnut","🍩"], ["ice cream","🍨"], ["soft serve","🍦"], ["shaved ice","🍧"],
           ["cake","🍰"], ["birthday cake","🎂"], ["cupcake","🧁"], ["pie","🥧"],
           ["cookie","🍪"], ["candy","🍬"], ["lollipop","🍭"], ["chocolate","🍫"], ["honey","🍯"],

           // cheese and pantry
           ["cheese","🧀"], ["butter","🧈"], ["salt","🧂"], ["jar","🫙"],

           // produce
           ["apple","🍎"], ["green apple","🍏"], ["banana","🍌"], ["strawberry","🍓"], ["blueberries","🫐"],
           ["grapes","🍇"], ["orange","🍊"], ["lemon","🍋"], ["pear","🍐"], ["peach","🍑"], ["mango","🥭"],
           ["pineapple","🍍"], ["melon","🍈"], ["watermelon","🍉"], ["kiwi","🥝"], ["coconut","🥥"],
           ["avocado","🥑"], ["tomato","🍅"], ["corn","🌽"], ["carrot","🥕"], ["potato","🥔"], ["sweet potato","🍠"],
           ["mushroom","🍄"], ["eggplant","🍆"], ["cucumber","🥒"], ["pickle","🥒"], ["broccoli","🥦"], ["leafy greens","🥬"], ["lettuce","🥬"],
           ["bell pepper","🫑"], ["pepper","🌶️"], ["garlic","🧄"], ["onion","🧅"], ["beans","🫘"], ["peanuts","🥜"], ["chestnut","🌰"], ["olive","🫒"],

           // misc
           ["popcorn","🍿"], ["coffee beans","☕"], ["bento box","🍱"], ["takeout box","🥡"]
         ]);

         // Food icon helper functions
         function normalizeTerm(s) {
           return s.toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
         }

         function pickEmoji(input) {
           const hasEmoji = /\p{Extended_Pictographic}/u.test(input);
           if (hasEmoji) {
             // Return the first emoji char
             const match = input.match(/\p{Extended_Pictographic}(\uFE0F\u20E3|\uFE0F|\u200D\p{Extended_Pictographic})*/u);
             if (match) return match[0];
           }
           const t = normalizeTerm(input);
           if (FOOD_MAP.has(t)) return FOOD_MAP.get(t);
           // Try simple plural trim
           if (t.endsWith('es') && FOOD_MAP.has(t.slice(0, -2))) return FOOD_MAP.get(t.slice(0, -2));
           if (t.endsWith('s') && FOOD_MAP.has(t.slice(0, -1))) return FOOD_MAP.get(t.slice(0, -1));
           // Try removing common words
           const simplified = t.replace(/^(a|an|the)\s+/g, '').replace(/\s+emoji$/g, '');
           if (FOOD_MAP.has(simplified)) return FOOD_MAP.get(simplified);
           // Light fuzzy fallback
           const keys = Array.from(FOOD_MAP.keys()).sort((a,b)=>b.length - a.length);
           for (const k of keys) {
             if (simplified.includes(k) || k.includes(simplified)) return FOOD_MAP.get(k);
           }
           return '🍽️'; // Default food emoji
         }

         // Put this helper above updateCharts()
         function computeWeightSeries(weightByDate, futureDays = 3) {
           // Collect actual points, sorted
           const actualDates = Object.keys(weightByDate)
             .filter(d => typeof weightByDate[d] === 'number' && !isNaN(weightByDate[d]))
             .sort();

           if (actualDates.length === 0) {
             return { labels: [], actual: [], projected: [] };
           }

           // Build recent slice for trend (up to last 3 actual points)
           const recentDates = actualDates.slice(-3);
           const recentPoints = recentDates.map(d => ({
             date: d,
             ts: new Date(d).getTime(),
             w: weightByDate[d]
           }));

           // Average daily change
           let slopePerDay = 0;
           if (recentPoints.length >= 2) {
             const first = recentPoints[0];
             const last = recentPoints[recentPoints.length - 1];
             const days = Math.max(1, Math.round((last.ts - first.ts) / (1000 * 60 * 60 * 24)));
             slopePerDay = (last.w - first.w) / days;
           } // if only one point, slope remains 0

           // Labels = all actual dates + next N future dates
           const lastDate = new Date(actualDates[actualDates.length - 1]);
           const futureLabels = [];
           for (let i = 1; i <= futureDays; i++) {
             const d = new Date(lastDate.getTime() + i * 24 * 60 * 60 * 1000);
             futureLabels.push(d.toISOString().split('T')[0]);
           }
           const labels = [...actualDates, ...futureLabels];

           // Actual values align to labels, null for future
           const actual = labels.map(d => (weightByDate[d] ?? null));

           // Projected values: null for all past labels except the last actual index,
           // then extend using slope for future labels
           const projected = new Array(labels.length).fill(null);
           const lastIdx = actualDates.length - 1;
           const lastWeight = weightByDate[actualDates[lastIdx]];
           projected[lastIdx] = lastWeight; // anchor so the dotted line starts here
           for (let i = 1; i <= futureDays; i++) {
             projected[lastIdx + i] = lastWeight + slopePerDay * i;
           }

           return { labels, actual, projected };
     }

         function updateCharts(){
           const labels = getAllDates();

           // calories burned per day
           const burned = labels.map(d => (basalByDate[d] || 0) + (activityByDate[d] || 0));

           // calories eaten per day, now includes ALL foods
           const foodCalories = labels.map(d => computeFoodCaloriesForDate(d));

           // deficit = burned minus eaten
           const deficit = labels.map((_, i) => burned[i] - foodCalories[i]);

           // ----- Total chart (desktop) -----
           totalChart.data.labels = labels;
           const isDetailed = totalChart.data.datasets.length > 1;
           if (isDetailed) {
             totalChart.data.datasets[0].data = burned;       // Calories Burned
             totalChart.data.datasets[1].data = foodCalories; // Calories Eaten
           } else {
             totalChart.data.datasets[0].data = deficit;      // Calorie Deficit
           }
           totalChart.update();

           // ----- Total chart (mobile) -----
           mobileTotalChart.data.labels = labels;
           const isMobileDetailed = mobileTotalChart.data.datasets.length > 1;
           if (isMobileDetailed) {
             mobileTotalChart.data.datasets[0].data = burned;
             mobileTotalChart.data.datasets[1].data = foodCalories;
           } else {
             mobileTotalChart.data.datasets[0].data = deficit;
           }
           mobileTotalChart.update();

           // ----- Workout charts -----
           const workoutPerDay = labels.map(d => {
             let t = 0;
             const w = workoutDataByDate[d];
             // Use cumulative calories for each workout type
             if (w?.treadmill?.calories) t += w.treadmill.calories;
             if (w?.stairs?.calories)    t += w.stairs.calories;
             return t;
           });

           workoutChart.data.labels = labels;
           const isWorkoutFat = workoutChart.options.scales.y.title?.text === 'Fat Loss (lbs)';
           workoutChart.data.datasets[0].data = isWorkoutFat ? workoutPerDay.map(v => v/3500) : workoutPerDay;
           workoutChart.update();

           mobileWorkoutChart.data.labels = labels;
           const isMobileWorkoutFat = mobileWorkoutChart.options.scales.y.title?.text === 'Fat Loss (lbs)';
           mobileWorkoutChart.data.datasets[0].data = isMobileWorkoutFat ? workoutPerDay.map(v => v/3500) : workoutPerDay;
           mobileWorkoutChart.update();

           // ----- Food chart (mobile) -----
           mobileFoodChart.data.labels = labels;
           const isMobileFoodFat = mobileFoodChart.options.scales.y.title?.text === 'Fat Loss (lbs)';
           mobileFoodChart.data.datasets[0].data = isMobileFoodFat ? foodCalories.map(v => v/3500) : foodCalories;
           mobileFoodChart.update();

           // ----- Weight charts -----
           if (userProfile) {
             const { labels: wLabels, actual: wActual, projected: wProjected } =
               computeWeightSeries(weightByDate, 3);

             // desktop
             weightChart.data.labels = wLabels;
             const isWeightFat = weightChart.options.scales.y.title?.text === 'Fat Loss (lbs)';
             if (isWeightFat) {
               const perDay = wLabels.map(d => ((basalByDate[d] || 0) + (activityByDate[d] || 0)) / 3500);
               weightChart.data.datasets[0].data = perDay;
               weightChart.data.datasets[1].data = perDay;
             } else {
               weightChart.data.datasets[0].data = wActual;
               weightChart.data.datasets[1].data = wProjected;
             }
             weightChart.update();

             // mobile
             mobileWeightChart.data.labels = wLabels;
             const isMobileWeightFat = mobileWeightChart.options.scales.y.title?.text === 'Fat Loss (lbs)';
             if (isMobileWeightFat) {
               const perDay = wLabels.map(d => ((basalByDate[d] || 0) + (activityByDate[d] || 0)) / 3500);
               mobileWeightChart.data.datasets[0].data = perDay;
               mobileWeightChart.data.datasets[1].data = perDay;
             } else {
               mobileWeightChart.data.datasets[0].data = wActual;
               mobileWeightChart.data.datasets[1].data = wProjected;
             }
             mobileWeightChart.update();
           }
         }

    // ===== Treadmill =====
    let tctx=document.getElementById('tchart').getContext('2d');
    let tchart=new Chart(tctx,{type:'line',data:{labels:[],datasets:[{label:'Calories Burned',data:[],borderColor:'#6ee7b7',fill:false,tension:0.25}]},options:{scales:{y:{beginAtZero:true}}}});

         function treadmillInputs(){
       return {w:userProfile?.weight||170,s:+tspeed.value,g:+tgrade.value,m:+tdur.value};
     }

     function saveTreadmillInputs() {
       const inputs = treadmillInputs();
       const today = todayStr();
       if (!workoutDataByDate[today]) {
         workoutDataByDate[today] = {};
       }
       workoutDataByDate[today].treadmill = inputs;
       saveUserData();
     }

     function loadTreadmillInputs() {
       const today = todayStr();
       if (workoutDataByDate[today] && workoutDataByDate[today].treadmill) {
         const data = workoutDataByDate[today].treadmill;
         tspeed.value = data.s || 3.5;
         tgrade.value = data.g || 7.5;
         tdur.value = data.m || 30;
         previewTreadmill();
       } else {
         // Set default values if no saved data
         tspeed.value = 3.5;
         tgrade.value = 7.5;
         tdur.value = 30;
         previewTreadmill();
       }
     }

     function loadTreadmillChart() {
       // Clear existing chart data
       tchart.data.labels = [];
       tchart.data.datasets[0].data = [];
       
       // Load treadmill data from Firebase - shows cumulative daily totals
       const dates = Object.keys(workoutDataByDate).sort();
       dates.forEach(date => {
         if (workoutDataByDate[date].treadmill && workoutDataByDate[date].treadmill.calories) {
           tchart.data.labels.push(date);
           tchart.data.datasets[0].data.push(workoutDataByDate[date].treadmill.calories);
         }
       });
       tchart.update();
     }

     function loadStairsChart() {
       // Clear existing chart data
       schart.data.labels = [];
       schart.data.datasets[0].data = [];
       
       // Load stairs data from Firebase - shows cumulative daily totals
       const dates = Object.keys(workoutDataByDate).sort();
       dates.forEach(date => {
         if (workoutDataByDate[date].stairs && workoutDataByDate[date].stairs.calories) {
           schart.data.labels.push(date);
           schart.data.datasets[0].data.push(workoutDataByDate[date].stairs.calories);
         }
       });
       schart.update();
     }
    function previewTreadmill(){
      const {w,s,g,m}=treadmillInputs();
      if(w>0 && s>0 && g>=0 && m>0){
        const total=calcTreadmillKcal(w,s,g,m);
        tresult.innerHTML=`<div class='math'>Preview ≈ ${Math.round(total)} kcal</div>`;
      } else {
        tresult.innerHTML='';
      }
    }
         function renderTreadmill(lbs,mph,gradePct,minutes){
       const total=calcTreadmillKcal(lbs,mph,gradePct,minutes);
       tresult.innerHTML=`<div class='math'>Logged ≈ ${Math.round(total)} kcal</div>`;
       addActivityForToday(total);
       
       // Save workout data to Firebase for graphs
       const today=todayStr();
       if (!workoutDataByDate[today]) {
         workoutDataByDate[today] = {};
       }
       
       // If there's already treadmill data for today, add to it instead of replacing
       if (workoutDataByDate[today].treadmill) {
         workoutDataByDate[today].treadmill.calories += Math.round(total);
         // Update the individual workout data as well
         if (!workoutDataByDate[today].treadmill.workouts) {
           workoutDataByDate[today].treadmill.workouts = [];
         }
         workoutDataByDate[today].treadmill.workouts.push({
           w: lbs, s: mph, g: gradePct, m: minutes,
           calories: Math.round(total)
         });
       } else {
         workoutDataByDate[today].treadmill = {
           w: lbs, s: mph, g: gradePct, m: minutes,
           calories: Math.round(total),
           workouts: [{
             w: lbs, s: mph, g: gradePct, m: minutes,
             calories: Math.round(total)
           }]
         };
       }
       
       saveUserData();
       
       // Update treadmill chart with cumulative total
       loadTreadmillChart();
       
       // Update overall workout chart
       updateCharts();
       
       // Update streaks
       calculateStreaks();
       updateStreakDisplay();
     }
         ['input','change'].forEach(evt=>{
       tspeed.addEventListener(evt,()=>{
         previewTreadmill();
         saveTreadmillInputs();
       });
       tgrade.addEventListener(evt,()=>{
         previewTreadmill();
         saveTreadmillInputs();
       });
       tdur.addEventListener(evt,()=>{
         previewTreadmill();
         saveTreadmillInputs();
       });
     });
         tcalc.addEventListener('click',()=>{
       const {w,s,g,m}=treadmillInputs();
       if(!w||!s||!g||!m){tresult.innerHTML='<p>Please enter all values</p>';return;}
       renderTreadmill(w,s,g,m);
     });

    // ===== Stairs =====
    let sctx=document.getElementById('schart').getContext('2d');
    let schart=new Chart(sctx,{type:'line',data:{labels:[],datasets:[{label:'Calories Burned',data:[],borderColor:'#6ee7b7',fill:false,tension:0.25}]},options:{scales:{y:{beginAtZero:true}}}});

    sintensity.addEventListener('change',()=>{
      const isCustom = sintensity.value==='custom';
      document.getElementById('customMetField').classList.toggle('hidden', !isCustom);
    });
         function renderStairs(lbs, minutes, met){
       const total=calcStairKcal(lbs, minutes, met);
       sresult.innerHTML=`<div class='math'>≈ ${Math.round(total)} kcal burned</div>`;
       addActivityForToday(total);
       
       // Save workout data to Firebase for graphs
       const today=todayStr();
       if (!workoutDataByDate[today]) {
         workoutDataByDate[today] = {};
       }
       
       // If there's already stairs data for today, add to it instead of replacing
       if (workoutDataByDate[today].stairs) {
         workoutDataByDate[today].stairs.calories += Math.round(total);
         // Update the individual workout data as well
         if (!workoutDataByDate[today].stairs.workouts) {
           workoutDataByDate[today].stairs.workouts = [];
         }
         workoutDataByDate[today].stairs.workouts.push({
           w: lbs, m: minutes, met: met,
           calories: Math.round(total)
         });
       } else {
         workoutDataByDate[today].stairs = {
           w: lbs, m: minutes, met: met,
           calories: Math.round(total),
           workouts: [{
             w: lbs, m: minutes, met: met,
             calories: Math.round(total)
           }]
         };
       }
       
       saveUserData();
       
       // Update stairs chart with cumulative total
       loadStairsChart();
       
       // Update overall workout chart
       updateCharts();
       
       // Update streaks
       calculateStreaks();
       updateStreakDisplay();
     }
         scalc.addEventListener('click',()=>{
       const w=userProfile?.weight||170, m=+sdur.value;
       let met = sintensity.value==='custom' ? +scustom.value : +sintensity.value;
       if(!w||!m||!met){sresult.innerHTML='<p>Please enter all values</p>';return;}
       renderStairs(w, m, met);
     });

    // ===== Workouts Menu Show/Hide =====
    const workoutMenu=document.getElementById('workoutMenu');
    const showBtn=document.getElementById('showWorkouts');
    const toggleSection=document.getElementById('workoutToggleSection');

    function setShowBtnVisible(vis){ toggleSection.style.display = vis ? '' : 'none'; }
    function setMenuVisible(vis){ workoutMenu.classList.toggle('hidden', !vis); }

         showBtn.addEventListener('click',()=>{
       const willShow = workoutMenu.classList.contains('hidden');
       setMenuVisible(willShow);
       showBtn.textContent = willShow ? 'Hide Workouts' : 'Show Workouts';
       // Hide the toggle button when workouts are shown
       setShowBtnVisible(!willShow);
     });

         document.getElementById('hideWorkouts').addEventListener('click',()=>{
       setMenuVisible(false);
       showBtn.textContent = 'Show Workouts';
       // Show the toggle button when workouts are hidden
       setShowBtnVisible(true);
     });

         document.getElementById('openTreadmill').addEventListener('click',()=>{
       setMenuVisible(false);
       document.getElementById('treadmillSection').classList.remove('hidden');
       setShowBtnVisible(false);
       loadTreadmillInputs();
       loadTreadmillChart();
     });
         document.getElementById('openStairs').addEventListener('click',()=>{
       setMenuVisible(false);
       document.getElementById('stairSection').classList.remove('hidden');
       setShowBtnVisible(false);
       loadStairsChart();
     });
         document.getElementById('backFromTreadmill').addEventListener('click',()=>{
       document.getElementById('treadmillSection').classList.add('hidden');
       setMenuVisible(true);
       setShowBtnVisible(false);
       showBtn.textContent='Hide Workouts';
     });
     document.getElementById('backFromStairs').addEventListener('click',()=>{
       document.getElementById('stairSection').classList.add('hidden');
       setMenuVisible(true);
       setShowBtnVisible(false);
       showBtn.textContent='Hide Workouts';
     });

         // ===== Show More Toggle =====
     document.getElementById('toggleFat').addEventListener('click',()=>{
       const isDetailed = totalChart.data.datasets.length > 1;
       if (isDetailed) {
         // Switch back to deficit view
         totalChart.data.datasets = [{
           label: 'Calorie Deficit',
           data: [],
           borderColor: '#6ee7b7',
           backgroundColor: 'rgba(110,231,183,.3)',
           fill: true,
           tension: 0.25
         }];
         document.getElementById('toggleFat').textContent = 'Show More';
       } else {
         // Switch to detailed view
         totalChart.data.datasets = [
           {
             label: 'Calories Burned',
             data: [],
             borderColor: '#6ee7b7',
             backgroundColor: 'rgba(110,231,183,.3)',
             fill: true,
             tension: 0.25
           },
           {
             label: 'Calories Eaten',
             data: [],
             borderColor: '#f59e0b',
             backgroundColor: 'rgba(245,158,11,.3)',
             fill: true,
             tension: 0.25
           }
         ];
         document.getElementById('toggleFat').textContent = 'Show Deficit';
       }
       updateCharts();
     });

     // Mobile show more toggles
     document.getElementById('mobileToggleFat').addEventListener('click',()=>{
       const isDetailed = mobileTotalChart.data.datasets.length > 1;
       if (isDetailed) {
         // Switch back to deficit view
         mobileTotalChart.data.datasets = [{
           label: 'Calorie Deficit',
           data: [],
           borderColor: '#6ee7b7',
           backgroundColor: 'rgba(110,231,183,.3)',
           fill: true,
           tension: 0.25
         }];
         document.getElementById('mobileToggleFat').textContent = 'Show More';
       } else {
         // Switch to detailed view
         mobileTotalChart.data.datasets = [
           {
             label: 'Calories Burned',
             data: [],
             borderColor: '#6ee7b7',
             backgroundColor: 'rgba(110,231,183,.3)',
             fill: true,
             tension: 0.25
           },
           {
             label: 'Calories Eaten',
             data: [],
             borderColor: '#f59e0b',
             backgroundColor: 'rgba(245,158,11,.3)',
             fill: true,
             tension: 0.25
           }
         ];
         document.getElementById('mobileToggleFat').textContent = 'Show Deficit';
       }
       updateCharts();
     });

     document.getElementById('mobileToggleWeightFat').addEventListener('click',()=>{
       const isFat=mobileWeightChart.options.scales.y.title?.text==='Fat Loss (lbs)';
       mobileWeightChart.options.scales.y.title={display:true,text: isFat ? 'Weight (lbs)' : 'Fat Loss (lbs)'};
       updateCharts();
     });

     document.getElementById('mobileToggleWorkoutFat').addEventListener('click',()=>{
       const isFat=mobileWorkoutChart.options.scales.y.title?.text==='Fat Loss (lbs)';
       mobileWorkoutChart.options.scales.y.title={display:true,text: isFat ? 'Calories' : 'Fat Loss (lbs)'};
       updateCharts();
     });

     document.getElementById('mobileToggleFoodDetail').addEventListener('click',()=>{
       const isDetailed = mobileFoodChart.data.datasets.length > 1;
       if (isDetailed) {
         // Switch back to total view
         mobileFoodChart.data.datasets = [{
           label: 'Food Calories',
           data: [],
           borderColor: '#f59e0b',
           backgroundColor: 'rgba(245,158,11,.3)',
           fill: true,
           tension: 0.25
         }];
         document.getElementById('mobileToggleFoodDetail').textContent = 'Show More';
       } else {
         // Switch to detailed view showing individual foods
         const labels = getAllDates();
         const foodNames = new Set();
         
         // Collect all unique food names
         labels.forEach(date => {
           const day = foodDataByDate[date] || {};
           Object.values(day).forEach(food => {
             if (food.name) foodNames.add(food.name);
           });
         });
         
         const datasets = [];
         const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#f97316', '#06b6d4', '#84cc16'];
         
         Array.from(foodNames).forEach((foodName, index) => {
           const foodData = labels.map(date => {
             const day = foodDataByDate[date] || {};
             const food = Object.values(day).find(f => f.name === foodName);
             return food ? food.totalCalories : 0;
           });
           
           datasets.push({
             label: foodName,
             data: foodData,
             borderColor: colors[index % colors.length],
             backgroundColor: colors[index % colors.length] + '40',
             fill: false,
             tension: 0.25
           });
         });
         
         mobileFoodChart.data.datasets = datasets;
         document.getElementById('mobileToggleFoodDetail').textContent = 'Show Total';
       }
       updateCharts();
     });

     document.getElementById('toggleWorkoutFat').addEventListener('click',()=>{
       const isFat=workoutChart.options.scales.y.title?.text==='Fat Loss (lbs)';
       workoutChart.options.scales.y.title={display:true,text: isFat ? 'Calories' : 'Fat Loss (lbs)'};
       updateCharts();
     });

     document.getElementById('toggleWeightFat').addEventListener('click',()=>{
       const isFat=weightChart.options.scales.y.title?.text==='Fat Loss (lbs)';
       weightChart.options.scales.y.title={display:true,text: isFat ? 'Weight (lbs)' : 'Fat Loss (lbs)'};
       updateCharts();
     });

     document.getElementById('toggleTreadmillFat').addEventListener('click',()=>{
       const isFat=tchart.options.scales.y.title?.text==='Fat Loss (lbs)';
       tchart.options.scales.y.title={display:true,text: isFat ? 'Calories' : 'Fat Loss (lbs)'};
       tchart.update();
     });

     document.getElementById('toggleStairsFat').addEventListener('click',()=>{
       const isFat=schart.options.scales.y.title?.text==='Fat Loss (lbs)';
       schart.options.scales.y.title={display:true,text: isFat ? 'Calories' : 'Fat Loss (lbs)'};
       schart.update();
     });

         // ===== Manual Add Calories =====
     document.getElementById('addCaloriesBtn').addEventListener('click', showAddCaloriesModal);
     
     // Mobile button event listeners
     document.getElementById('mobileAddCaloriesBtn').addEventListener('click', showAddCaloriesModal);
     document.getElementById('mobileAddWeightBtn').addEventListener('click', showAddWeightModal);
     document.getElementById('mobileShowWorkouts').addEventListener('click', () => {
       // Show mobile workout menu modal
       showMobileWorkoutMenu();
     });
     document.getElementById('mobileShowFoods').addEventListener('click', () => {
       // Show mobile food menu modal
       showMobileFoodMenu();
     });
     document.getElementById('mobileOpenSettings').addEventListener('click', showSettings);
     document.getElementById('mobileDeleteAccountBtn').addEventListener('click', async () => {
       if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
         try {
           await db.collection('users').doc(currentUser.uid).delete();
           await currentUser.delete();
           auth.signOut();
         } catch (error) {
           console.error('Error deleting account:', error);
           alert('Error deleting account. Please try again.');
         }
       }
     });
     document.getElementById('mobileLogoutBtn').addEventListener('click', () => {
       auth.signOut();
     });
     
     // Mobile workout menu event listeners
     document.getElementById('closeMobileWorkoutMenu').addEventListener('click', hideMobileWorkoutMenu);
     document.getElementById('mobileOpenTreadmill').addEventListener('click', () => {
       hideMobileWorkoutMenu();
       showMobileTreadmillModal();
     });
     document.getElementById('mobileOpenStairs').addEventListener('click', () => {
       hideMobileWorkoutMenu();
       showMobileStairsModal();
     });
     
     // Mobile food menu event listeners
     document.getElementById('closeMobileFoodMenu').addEventListener('click', hideMobileFoodMenu);
     document.getElementById('mobileAddCustomFood').addEventListener('click', () => {
       hideMobileFoodMenu();
       showMobileCustomFoodModal();
     });
     
     // Mobile treadmill event listeners
     document.getElementById('closeMobileTreadmill').addEventListener('click', hideMobileTreadmillModal);
     document.getElementById('mobileTcalc').addEventListener('click', () => {
       const w = userProfile?.weight || 170;
       const s = +document.getElementById('mobileTspeed').value;
       const g = +document.getElementById('mobileTgrade').value;
       const m = +document.getElementById('mobileTdur').value;
       
       if (!w || !s || !g || !m) {
         document.getElementById('mobileTresult').innerHTML = '<p>Please enter all values</p>';
         return;
       }
       
       const total = calcTreadmillKcal(w, s, g, m);
       document.getElementById('mobileTresult').innerHTML = `<div class='math'>Logged ≈ ${Math.round(total)} kcal</div>`;
       addActivityForToday(total);
       
       // Save workout data to Firebase for graphs
       const today = todayStr();
       if (!workoutDataByDate[today]) {
         workoutDataByDate[today] = {};
       }
       
       // If there's already treadmill data for today, add to it instead of replacing
       if (workoutDataByDate[today].treadmill) {
         workoutDataByDate[today].treadmill.calories += Math.round(total);
         // Update the individual workout data as well
         if (!workoutDataByDate[today].treadmill.workouts) {
           workoutDataByDate[today].treadmill.workouts = [];
         }
         workoutDataByDate[today].treadmill.workouts.push({
           w: w, s: s, g: g, m: m,
           calories: Math.round(total)
         });
       } else {
         workoutDataByDate[today].treadmill = {
           w: w, s: s, g: g, m: m,
           calories: Math.round(total),
           workouts: [{
             w: w, s: s, g: g, m: m,
             calories: Math.round(total)
           }]
         };
       }
       saveUserData();
       
       // Update charts
       updateCharts();
       
       // Update streaks
       calculateStreaks();
       updateStreakDisplay();
       
       // Close modal after a short delay
       setTimeout(() => {
         hideMobileTreadmillModal();
       }, 2000);
     });
     
     // Mobile stairs event listeners
     document.getElementById('closeMobileStairs').addEventListener('click', hideMobileStairsModal);
     document.getElementById('mobileScalc').addEventListener('click', () => {
       const w = userProfile?.weight || 170;
       const m = +document.getElementById('mobileSdur').value;
       let met = document.getElementById('mobileSintensity').value === 'custom' ? 
         +document.getElementById('mobileScustom').value : 
         +document.getElementById('mobileSintensity').value;
       
       if (!w || !m || !met) {
         document.getElementById('mobileSresult').innerHTML = '<p>Please enter all values</p>';
         return;
       }
       
       const total = calcStairKcal(w, m, met);
       document.getElementById('mobileSresult').innerHTML = `<div class='math'>≈ ${Math.round(total)} kcal burned</div>`;
       addActivityForToday(total);
       
       // Save workout data to Firebase for graphs
       const today = todayStr();
       if (!workoutDataByDate[today]) {
         workoutDataByDate[today] = {};
       }
       
       // If there's already stairs data for today, add to it instead of replacing
       if (workoutDataByDate[today].stairs) {
         workoutDataByDate[today].stairs.calories += Math.round(total);
         // Update the individual workout data as well
         if (!workoutDataByDate[today].stairs.workouts) {
           workoutDataByDate[today].stairs.workouts = [];
         }
         workoutDataByDate[today].stairs.workouts.push({
           w: w, m: m, met: met,
           calories: Math.round(total)
         });
       } else {
         workoutDataByDate[today].stairs = {
           w: w, m: m, met: met,
           calories: Math.round(total),
           workouts: [{
             w: w, m: m, met: met,
             calories: Math.round(total)
           }]
         };
       }
       saveUserData();
       
       // Update charts
       updateCharts();
       
       // Update streaks
       calculateStreaks();
       updateStreakDisplay();
       
       // Close modal after a short delay
       setTimeout(() => {
         hideMobileStairsModal();
       }, 2000);
     });
     
     // Mobile treadmill input event listeners
     ['input', 'change'].forEach(evt => {
       document.getElementById('mobileTspeed').addEventListener(evt, previewMobileTreadmill);
       document.getElementById('mobileTgrade').addEventListener(evt, previewMobileTreadmill);
       document.getElementById('mobileTdur').addEventListener(evt, previewMobileTreadmill);
     });
     
     // Mobile stairs intensity change listener
     document.getElementById('mobileSintensity').addEventListener('change', () => {
       const isCustom = document.getElementById('mobileSintensity').value === 'custom';
       document.getElementById('mobileCustomMetField').classList.toggle('hidden', !isCustom);
     });
     

     
     // Mobile custom food event listeners
     document.getElementById('mobileCustomFoodCalc').addEventListener('click', () => {
       const name = document.getElementById('mobileCustomFoodName').value;
       const calories = +document.getElementById('mobileCustomFoodCalories').value;
       
       if (!name || !calories) {
         document.getElementById('mobileCustomFoodResult').innerHTML = '<p>Please enter both name and calories</p>';
         return;
       }
       
       if (calories <= 0) {
         document.getElementById('mobileCustomFoodResult').innerHTML = '<p>Please enter a valid calorie amount</p>';
         return;
       }
       
       const isUpdate = document.getElementById('mobileCustomFoodCalc').textContent === 'Add Food Calories';
       
       // Save custom food to Firebase
       const icon = pickEmoji(name);
       customFoods[name] = {
         name: name,
         calories: calories,
         icon: icon
       };
       
       // Also save to food data for today's tracking
       const today = todayStr();
       if (!foodDataByDate[today]) {
         foodDataByDate[today] = {};
       }
       
       // For updates, we need to find and update the existing entry
       if (isUpdate) {
         const originalName = document.getElementById('mobileCustomFoodModal').dataset.originalName;
         
         // Find the existing food entry and add to it
         Object.keys(foodDataByDate[today]).forEach(key => {
           if (foodDataByDate[today][key].name === originalName) {
             // Add to the existing calories instead of replacing
             const existingCalories = foodDataByDate[today][key].totalCalories || 0;
             const newTotalCalories = existingCalories + calories;
             
             foodDataByDate[today][key] = {
               name: name,
               calories: calories,
               quantity: 1,
               totalCalories: newTotalCalories
             };
           }
         });
       } else {
         // For new foods, add to today's data
         foodDataByDate[today][name.toLowerCase().replace(/\s+/g, '_')] = {
           name: name,
           calories: calories,
           quantity: 1,
           totalCalories: calories
         };
       }
       
       saveUserData();
       
       // Update food menu to show new custom food
       updateFoodMenu();
       
       // Update charts to show the new food calories
       updateCharts();
       
       document.getElementById('mobileCustomFoodResult').innerHTML = `<div class='math'>${isUpdate ? 'Logged' : 'Added'}: ${name} (${calories} kcal)</div>`;
       
       // Close modal after a short delay
       setTimeout(() => {
         hideMobileCustomFoodModal();
       }, 2000);
     });
     
     // Mobile custom food input event listeners
     document.getElementById('mobileCustomFoodName').addEventListener('input', updateCustomFoodIcon);
     
     // Mobile delete custom food event listener
     document.getElementById('mobileDeleteCustomFood').addEventListener('click', () => {
       const name = document.getElementById('mobileCustomFoodName').value;
       
       if (!name) {
         document.getElementById('mobileCustomFoodResult').innerHTML = '<p>Please enter a food name to delete</p>';
         return;
       }
       
       // Remove from custom foods
       delete customFoods[name];
       
       // Remove from today's food data
       const today = todayStr();
       if (foodDataByDate[today]) {
         Object.keys(foodDataByDate[today]).forEach(key => {
           if (foodDataByDate[today][key].name === name) {
             delete foodDataByDate[today][key];
           }
         });
       }
       
       saveUserData();
       updateFoodMenu();
       updateCharts();
       
       document.getElementById('mobileCustomFoodResult').innerHTML = `<div class='math'>Deleted: ${name}</div>`;
       
       // Close modal after a short delay
       setTimeout(() => {
         hideMobileCustomFoodModal();
       }, 2000);
     });
     
     // Mobile food modal close event listeners
     document.getElementById('closeMobileCustomFood').addEventListener('click', hideMobileCustomFoodModal);
     
     // Add Calories Modal Event Listeners
     document.getElementById('cancelAddCalories').addEventListener('click', hideAddCaloriesModal);
     document.getElementById('submitAddCalories').addEventListener('click', () => {
       const calories = Number(document.getElementById('caloriesAmount').value);
       const date = document.getElementById('caloriesDate').value;
       const errorDiv = document.getElementById('addCaloriesError');
       const successDiv = document.getElementById('addCaloriesSuccess');
       
       if (!calories || !date) {
         errorDiv.textContent = 'Please fill in all fields';
         errorDiv.classList.remove('hidden');
         successDiv.classList.add('hidden');
         return;
       }
       
       if (isNaN(calories)) {
         errorDiv.textContent = 'Please enter a valid number';
         errorDiv.classList.remove('hidden');
         successDiv.classList.add('hidden');
         return;
       }
       
       try {
         // Add calories for the specific date
         const d = date;
         if (!activityByDate[d]) activityByDate[d] = 0;
         activityByDate[d] += Math.round(calories);
         updateCharts();
         saveUserData();
         
         errorDiv.classList.add('hidden');
         successDiv.textContent = 'Calories updated successfully!';
         successDiv.classList.remove('hidden');
         
         setTimeout(() => {
           hideAddCaloriesModal();
         }, 1500);
       } catch (error) {
         errorDiv.textContent = error.message;
         errorDiv.classList.remove('hidden');
         successDiv.classList.add('hidden');
       }
     });

         // Initialize app
     window.addEventListener('DOMContentLoaded',()=>{
       console.log('DOM loaded, initializing app...');
       
       liftModalsToBody(); // <-- make modals visible on mobile
       
       // Prefill example values for profile setup
       document.getElementById('setupAge').value=22;
       document.getElementById('setupHeightFt').value=5;
       document.getElementById('setupHeightIn').value=9;
       document.getElementById('setupWeight').value=170;
       
       // Prefill treadmill preview with defaults
       tspeed.value=3.5; tgrade.value=7.5; tdur.value=30; previewTreadmill();
       
                // Initialize mobile swipe functionality
       initMobileSwipe();
       
       // Initialize mobile slides
       showSlide(0);
       
       // Initialize food menu
       updateFoodMenu();
       
       // Ensure auth modal shows for new users
       if (!currentUser) {
         setTimeout(() => {
           showAuthModal();
         }, 300);
       }
       
                // Force show auth modal initially, then let Firebase auth state take over
       setTimeout(() => {
         console.log('Initial timeout - authStateInitialized:', authStateInitialized);
         if (!authStateInitialized) {
           console.log('Showing auth modal initially');
           showAuthModal();
         }
       }, 200);
     });