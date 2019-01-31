# Vue Todo App
> A Vue.js project combining a modified front-end (https://github.com/vuejs/vue/tree/dev/examples/todomvc) and back-end built with Python/Flask (https://github.com/stewbawka/todo_api)

## Build Setup
### Back-end
#### Requirements
- python >= 3.6.0
- pipenv >= 11.9.0 (e.g. brew install pipenv on OS X)
- mysql >= 5.7.21

- These instructions assume MySQL is running on localhost:3306 with the root user available. Running from the root directory.

**Note:** You may want to create a separate python environment using `virtualenv`

``` bash
cd server

# Install dependencies
pipenv install

# Create DB
make create_db

# Run migrations
make run_migrations

# Seed database with initial data
make seed

# Run dev server
make run
```

### Front-end

``` bash
cd frontend
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

## Notes
- Undo functionality is not finished. It will de-select from any current tab, and appears to remove items from lists. A page refresh and loading the desired saved lists should bring you back to a working state.
- Jest tests not complete
- Consider creating unique actions to commit several things at once. This may help with the Undo functionality.
- Consider `computed` resources rather than actions in some cases.
- Create a mutations Enum
- Eorror handling is at a minimum - this project assumes user will use app correct and not go out of their way to try and break it.
- Undo button will be hidden if there are no more States to rollback.
- Consider automatic saving
- Split up into multiple components

**Important** If you end up getting the app into a bad state, refreshing the page should fix most issues.
