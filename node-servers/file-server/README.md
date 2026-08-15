# File server

Express middleware that serves files (mainly climb photos) from `file-storage/`,
gated by a passphrase-unlocked JWT for read access. Runs on the Namecheap
hosting account via cPanel's "Setup Node.js App" (Passenger).

## Environment variables

Set these in the cPanel Node.js app's environment variable configuration:

- `PORT` - port to listen on.
- `PASSPHRASE` - passphrase visitors use to unlock the private gallery.
- `JWT_SECRET_KEY` - secret used to sign/verify gallery unlock tokens.
- `ADMIN_TOKEN` - bearer token required by `POST /api/upload-files`. This is a
  separate credential from the gallery passphrase - anyone who knows the
  gallery passphrase can only read photos, only whoever holds `ADMIN_TOKEN`
  can write new ones. Generate a long random value and keep it out of git;
  the `add-activity` wizard in the repo root reads the matching value from
  its local `.env` as `FILE_SERVER_ADMIN_TOKEN`.

## Endpoints

- `GET /api/get-file?folder=&filename=` - serves a file, or a locked-gallery
  placeholder if the request isn't carrying a valid gallery token.
- `GET /api/list-files` - lists stored files by folder.
- `POST /api/unlock-gallery` - exchanges the gallery passphrase for a JWT.
- `GET /api/verify-token` - checks whether the caller's gallery token is valid.
- `POST /api/upload-files` - **admin only** (`Authorization: Bearer <ADMIN_TOKEN>`).
  Accepts `multipart/form-data` with a `folder` field and one or more `files`
  entries, and writes them into `file-storage/<folder>/`.

## Deploying changes

There's no CI/CD for this app - after editing `server.js`/`utils.js`, upload
the changed files to the cPanel Node.js app manually and restart it from the
cPanel UI for the change to take effect.
