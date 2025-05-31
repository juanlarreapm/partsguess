# PartsGuess Image Scraper

This scraper downloads high-quality images of aftermarket car parts for the PartsGuess game.

## Features

- Headless web scraping using Selenium + ChromeDriver
- Downloads top search images for 20 aftermarket car parts
- Handles errors gracefully and retries failed downloads
- Generates detailed reports of scraping results
- Saves images in organized format for game integration

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Make sure ChromeDriver is installed and in PATH, or install via:
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install chromium-chromedriver

# Or download from: https://chromedriver.chromium.org/
```

## Usage

Run the scraper:
```bash
python image_scraper.py
```

This will:
- Create an `images/` directory
- Download one high-quality image for each of the 20 parts
- Generate a `scraping_report.txt` with results

## Parts List

The scraper downloads images for these 20 aftermarket car parts:
1. Cold Air Intake
2. Coilover Suspension
3. Performance Exhaust
4. Blow-Off Valve
5. Big Brake Kit
6. Turbocharger
7. Intercooler
8. Sway Bar
9. Strut Tower Brace
10. Short Shifter
11. Racing Seats
12. Roll Cage
13. Lowering Springs
14. Aftermarket Wheels
15. Body Kit
16. Spoiler
17. Hood Scoop
18. Catback Exhaust
19. Wastegate
20. Fuel Injectors

## Output

- Images are saved as: `images/{part_name}.{ext}`
- Filenames are sanitized (lowercase, underscores instead of spaces)
- Supported formats: JPG, PNG, WebP
- Minimum file size: 1KB (to filter out tiny/broken images)

## Integration with Game

After running the scraper, you can update the game's `gameData` array in `components/parts-guess-game.tsx` to use the downloaded images instead of placeholder images.
