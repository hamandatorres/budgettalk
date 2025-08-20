# Budget Talk Showdown

A fun and interactive council member battle simulation where representatives engage in budget talks. Built with React 18 and Express.js.

![Budget Talk Showdown](public/logo192.png)

## 🎮 Features

- **Council Member Management**

  - View council members grouped by political party
  - Add custom council members with unique names and attributes
  - Track wins and seniority for each member

- **Battle System**

  - Drag-and-drop council members into battle positions
  - Battle outcomes determined by:
    - Years of service (seniority)
    - Previous wins
    - Random factor for unpredictability

- **Party System**
  - Five distinct parties: Progressive, Conservative, Moderate, Independent, and Green
  - Each party maintains its own roster
  - Members are replaced upon defeat (except user-created members)

## 🚀 Getting Started

### Prerequisites

- Node.js >=18.0.0
- npm or yarn
- Git
- Redux DevTools (browser extension) for development

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hamandatorres/budgettalk.git
   cd budgettalk
   ```

2. Install dependencies for both frontend and backend:

   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install
   ```

3. Start the development servers:

   In the main directory:

   ```bash
   # Start frontend
   npm start
   ```

   In the server directory:

   ```bash
   # Start backend
   npm start
   ```

The frontend will be available at [http://localhost:3000/budgettalk](http://localhost:3000/budgettalk)

### Development Tools

- Install Redux DevTools browser extension for debugging:
  - [Chrome Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
  - [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

## 🎮 How to Play

1. **View Council Members**

   - Members are grouped by their political party
   - Click on party headers to expand/collapse member lists
   - Each member shows their name, years of service, and win count

2. **Add Custom Members**

   - Click "Add Council Member" button
   - Enter name, select party, and set years of service (1-50)
   - Custom members are removed (not replaced) when they lose

3. **Battle System**
   - Drag members from their party lists to the battle arena
   - Click "TALK!" to initiate the budget battle
   - Winners gain experience points
   - Losing system-generated members are replaced
   - Losing user-created members are permanently removed

## 🛠️ Technology Stack

- **Frontend**

  - React 18
  - Redux with Redux Toolkit for state management
    - Centralized state handling
    - Async action creators for API calls
    - Optimized component rendering
  - Modern JavaScript (ES6+)
  - CSS3 with retro gaming style
  - Axios for API calls

- **Backend**
  - Express.js
  - Node.js
  - In-memory data storage

## 🏗️ Architecture

### Redux Store Structure

```
store/
├── slices/
│   ├── councilPersonSlice.js    # Council member data and API calls
│   ├── battleSlice.js           # Battle state and logic
│   └── uiSlice.js              # UI state (modals, expanded parties)
└── index.js                     # Store configuration
```

### State Management

- **Council Person State**
  - List of all council members
  - Loading and error states
  - CRUD operations through async thunks

- **Battle State**
  - Selected fighters
  - Winner information
  - Battle details and scoring

- **UI State**
  - Modal visibility
  - Expanded party sections
  - Loading indicators

## 🚀 Deployment

The application is deployed at:

- Frontend: [GitHub Pages](https://hamandatorres.github.io/budgettalk)
- Backend: [Heroku](https://evening-cliffs-17109-56706eeb61a8.herokuapp.com)

## 🔨 Development

### Available Scripts

- `npm start` - Run the frontend development server
- `npm test` - Run the test suite
- `npm run build` - Create a production build
- `npm run deploy` - Deploy to GitHub Pages

### Backend Scripts

In the server directory:

- `npm start` - Run the backend server

## � State Flow

### Component Structure

```
App
└── Arena
    ├── Council Member List
    │   └── Council Member (draggable)
    ├── Battle Arena
    │   ├── Fighter Slot 1
    │   ├── Fighter Slot 2
    │   └── FightResult
    └── AddCouncilPersonModal
```

### Redux Action Flow

1. **Council Member Management**
   ```
   User Action → Redux Action → API Call → Update Store → UI Update
   ```
   Example: Adding a new council member
   - User submits form
   - `createCouncilPerson` thunk dispatched
   - API call to create member
   - Store updated with new member
   - UI refreshes automatically

2. **Battle System**
   ```
   User Action → Battle Logic → API Updates → Store Updates → UI Updates
   ```
   Example: Battle sequence
   - User clicks "TALK!"
   - Battle calculations performed
   - Winner's stats updated in API
   - Loser removed/replaced via API
   - Store updated with results
   - UI shows winner and updates roster

## �📝 API Endpoints

- `GET /api/councilperson` - Get all council members
- `POST /api/councilperson` - Create a new council member
- `PUT /api/councilperson/:id` - Update a council member
- `DELETE /api/councilperson/:id` - Delete/replace a council member

## 🎨 Styling

The application features a retro gaming aesthetic with:

- Pixel-perfect fonts
- 8-bit style buttons and borders
- Responsive design for all screen sizes
- Drag and drop interface
- Clean animations and transitions

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [Create React App](https://github.com/facebook/create-react-app)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Press Start 2P Font](https://fonts.google.com/specimen/Press+Start+2P)
- [React Drag and Drop API](https://react-dnd.github.io/react-dnd/)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
