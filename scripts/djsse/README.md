# DJ Set Songs Extractor and Shazammer

## Description
This script extracts individual songs from a DJ set and identifies them using the Shazam API. It segments an audio file or YouTube video into smaller portions and then attempts to identify each segment's song information using different Shazam API services. The script is useful for DJs, music enthusiasts, or anyone who wants to break down a mixed DJ set into its individual tracks.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Parameters](#parameters)
- [Examples](#examples)
- [Output](#output)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)
- [Author(s)](#authors)

## Installation
To use this script, first, clone the repository and install the required Python packages.

```bash
# Clone the repository
git clone https://github.com/your-username/dj-set-songs-extractor.git
cd dj-set-songs-extractor

# Install dependencies
pip install -r requirements.txt
```


## Usage
You can run the script by providing a YouTube URL or a local audio file as input. The script will process the file, segment it, and identify the tracks using the Shazam API.

```bash
# Basic usage
python main.py --input "https://www.youtube.com/watch?v=example" --api yourdevmail

# If you want to process a local file:
python main.py --input "path/to/your/audiofile.mp3" --base-folder output_folder
```

### Parameters
| Parameter            | Type   | Description                                               | Default      |
|----------------------|--------|-----------------------------------------------------------|--------------|
| `--input`            | String | YouTube URL or path to the local audio file               | Required     |
| `--base-folder`      | String | Base folder for saving output files                       | `output`     |
| `--debug`            | Flag   | Enable debug mode for detailed logging                    | Disabled     |
| `--generate-timestamp`| Flag   | Generate a timestamp list for YouTube comments            | Disabled     |
| `--api`              | String | API to use for Shazam identification (`yourdevmail`, `dashydata`, etc.) | `yourdevmail`|
| `--segment-duration` | Int    | Duration of each audio segment in seconds (5-60)          | `20`         |

## Examples
Here are some examples of how to run the script:

```bash
# Example 1: Process a YouTube video and generate timestamps
python main.py --input "https://www.youtube.com/watch?v=example" --generate-timestamp --api yourdevmail

# Example 2: Process a local audio file in debug mode
python main.py --input "path/to/your/audiofile.mp3" --base-folder my_output --debug
```

## Output
The script outputs identified tracks in the specified base folder. Each identified track is saved as a separate `.wav` file named with the corresponding Shazam ID. If the `--generate-timestamp` option is enabled, a list of YouTube comment timestamps is also generated.

## Dependencies
This script requires Python and several Python libraries. The dependencies are listed in the `requirements.txt` file. You can install them with:

```bash
pip install -r requirements.txt
```

## Contributing
Contributions are welcome! Please follow these steps:

- **Issues:** Report bugs or request features by [opening an issue](https://github.com/your-username/dj-set-songs-extractor/issues).
- **Pull Requests:** Submit pull requests for code improvements or fixes. Ensure your code adheres to the project's coding standards and includes appropriate tests.
- **Code Style:** Follow PEP 8 for consistent code formatting.
- **Testing:** Add or update tests to ensure code quality and functionality.

## License
This script is distributed under the MIT License. See the `LICENSE` file for more details.

## Author(s)
**Author:** Your Name  
**Contact:** [your.email@example.com](mailto:your.email@example.com)

> DISABLED