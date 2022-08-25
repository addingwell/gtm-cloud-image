# GTM Cloud Image

This is a copy of the code available in https://gcr.io/cloud-tagging-10302018/gtm-cloud-image.

- Only the `app/` folder of the docker is copied.
- The `.js` code is run through [js-beautify](https://github.com/beautify-web/js-beautify) to be more readable.

Each time a version is flagged as `stable`, we create a new release, so you can be notified if you "watch" the directory.

## Creation of a new image:

### When a new Docker image is published:
1. `bash update.sh <image sha256>`
2. Get the timestamp of the new image https://gcr.io/v2/cloud-tagging-10302018/gtm-cloud-image/tags/list
3. Get the version in `app/package.json`
4. Commit with
```sh
GIT_COMMITTER_DATE="<ISO CreatedAt>" git commit -m "<package.json version> (<image sha256>)"
```
5. `git push`

### When a Docker image is flag as latest

1. Create new release
