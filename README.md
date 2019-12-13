# Open Collective changelog

We use this project to track weekly closed issues on [opencollective/opencollective](https://github.com/opencolllective/opencollective).

## Live URL

https://changelog.opencollective.com

## Development

### Prerequisites

#### Node.js

Make sure you have Node.js version >= 10. We recommend using [nvm](https://github.com/creationix/nvm): `nvm install`

### Install

```
git clone https://github.com/opencollective/opencollective-changelog.git
cd opencollective-changelog
npm install
```

### Start

`npm run dev`

This will start your local copy of Changelog. You can access it at `http://localhost:3000/`

## Updating Changelog

To update the changelog in order and see the latest changes:

- Run `npm run update:changelog`. The changelog will be updated.

- The latest changes will be added to the log file, commit the file.

- Open a PR to merge the changes with `master`.

## Production

### Prerequisite

#### Now

Changelog is currently deployed with [Now](https://zeit.co/now). You will need to install [Now Desktop](https://github.com/zeit/now-desktop) or [Now CLI](https://github.com/zeit/now-cli).

Authenticate with:

`now login`

Switch to the Open Collective team account:

`now switch opencollective`

### Deployment

- Run `now --prod` to deploy the latest changelog

- If everything is ok, finalize with: `now alias`

## License

Open Collective Changelog is made available under the [MIT License](LICENSE)
