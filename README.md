# Airbnb Clone (Full Stack)

A travel-focused web application inspired by Airbnb. Users can sign up, create and share travel
destination listings with an uploaded photo, browse other listings, and leave star ratings and
comments as reviews.

## Tech Stack

- **Node.js / Express** — server and routing
- **MongoDB / Mongoose** — data modeling and persistence
- **Passport.js (passport-local, passport-local-mongoose)** — authentication
- **Cloudinary + Multer** — image upload and storage
- **EJS + ejs-mate** — server-side rendered views with a shared layout
- **Bootstrap 5** — responsive UI
- **Joi** — server-side request validation
- **connect-flash** — one-time flash messages after redirects

## Project Structure

```
airbnb-clone/
├── app.js                 # entry point: DB connection, session/passport, routes, error handling
├── middleware.js          # isLoggedIn, isOwner, isReviewAuthor, validateListing/Review
├── schema.js              # Joi validation schemas
├── cloudConfig.js         # Cloudinary + multer-storage-cloudinary setup
├── models/                # Listing, Review, User (Mongoose schemas)
├── controllers/           # route handler logic, separated from routing
├── routes/                # listing.js, review.js, user.js
├── views/                 # EJS templates (listings, users, includes, layouts)
├── public/css/style.css   # custom styling
├── init/                  # data.js (sample listings) + index.js (seed script)
└── utils/                 # ExpressError, wrapAsync
```

## Run Locally

1. `npm install`
2. Copy `.env.example` to `.env` and fill in:
   - `ATLASDB_URL` — your MongoDB connection string (local or Atlas)
   - `SECRET` — session secret
   - `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET` — from your Cloudinary dashboard
3. `node app.js`
4. Visit `http://localhost:3000`

Optional: run `node init/index.js` to seed a handful of sample listings (sign up first and set
`SEED_OWNER_ID` in `.env` to that user's Mongo `_id` if you want the seeded listings to be
editable/deletable by that account).

## Today's Scope

Walk through: **signup/login → create a listing with an image → browse listings → leave a
review.**

Two things worth pointing out while demoing:

- **Ownership checks** — `isOwner` and `isReviewAuthor` middleware (in `middleware.js`) confirm
  `req.user._id` matches the listing's `owner` or the review's `author` before allowing edit or
  delete, both at the route layer and hidden in the view (Edit/Delete buttons only render for the
  owner).
- **Flash-message feedback pattern** — every mutating action (`create`, `update`, `delete`, login,
  signup, logout) sets `req.flash("success"/"error", ...)` before redirecting; a single
  middleware in `app.js` copies flash content into `res.locals` on the next request, and
  `views/includes/flash.ejs` renders it once as a dismissible Bootstrap alert.

## Notes

- Listing deletion cascades to its reviews via a Mongoose `post("findOneAndDelete")` hook on the
  `Listing` model.
- Passwords are never stored directly — `passport-local-mongoose` handles salting/hashing and
  exposes `User.register()` / `passport.authenticate("local")`.
- This is a demo/local project: no rate limiting, CSRF protection, or production session store
  (e.g. `connect-mongo`) is configured. Add those before deploying publicly.
