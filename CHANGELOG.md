# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## v1.0.1 (2/1/2025)

### Added
- Status bar warning for missing annotations files
- Button to create placeholder annotations file
- Support for multiple package.json files
- Setting to enable/disable extension
- Setting to ignore missing annotations warning

### Fixed
- Issue with blank lines in package.annotations.json file causing annotations to not appear

### Changed
- Updated package.json scripts search logic to be more efficient
- Updated annotation match logic to be more efficient


## v1.0.0 (2/1/2025)

#### Initial release

### Added
- Logic to search package.json file for scripts
- Logic to match scripts to with matching annotation
- Display of annotations via CodeLens