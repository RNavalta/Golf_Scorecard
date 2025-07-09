# 3UnderGolf

## Project Overview
3UnderGolf is a mobile golf scorecard app built with React Native and Expo. It allows users to select from multiple golf courses, set up players, track scores, and manage up to two saved games per course. The app is designed for ease of use and quick score entry, making it ideal for casual rounds with friends. **A key feature is that 3UnderGolf works fully offline and does not require cell or internet coverage, so you can use it anywhere on the course.**

## Features
- Select from multiple golf courses
- Enter and manage up to four player names
- Track scores for 18 holes per course
- Save and continue up to two games per course
- Delete saved games with confirmation
- Per-course saved game management
- Responsive design for both portrait and landscape orientations
- Scrollable screens for easy access on all devices

## Installation Instructions
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/3UnderGolf.git
   cd 3UnderGolf
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the Expo development server:**
   ```bash
   npx expo start
   ```
4. **Run on your device:**
   - Use the Expo Go app on your iOS or Android device to scan the QR code.
   - Or use an emulator/simulator from your development environment.

## Usage
1. Launch the app.
2. Tap "Begin" to start a new game.
3. Select a golf course.
4. Enter player names (up to four).
5. Start a new game or continue a saved game.
6. Enter scores for each hole as you play.
7. Save, continue, or delete games as needed.

## Technologies Used
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [OpenMoji](https://openmoji.org/) (for golf icons)

## Future Improvements
- Add support for more than four players
- Implement statistics and score history
- Add course editing or custom course creation
- Integrate with device contacts for player selection
- Add dark mode and theme customization

