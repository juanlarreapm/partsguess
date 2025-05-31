#!/usr/bin/env python3
"""
Image scraper for PartsGuess game - downloads top search images for aftermarket car parts
Uses headless Selenium with ChromeDriver for web scraping
"""

import os
import time
import requests
import hashlib
from urllib.parse import urlparse
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from parts_list import AUTOMOTIVE_PARTS, SEARCH_TERMS

class PartsImageScraper:
    def __init__(self, output_dir="images"):
        self.output_dir = output_dir
        self.setup_directories()
        self.driver = None
        
    def setup_directories(self):
        """Create necessary directories for storing images"""
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
            
    def setup_driver(self):
        """Setup headless Chrome driver"""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
        
        self.driver = webdriver.Chrome(options=chrome_options)
        
    def search_google_images(self, search_term):
        """Search Google Images for the given term and return image URLs"""
        try:
            search_url = f"https://www.google.com/search?q={search_term}&tbm=isch"
            self.driver.get(search_url)
            
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "img[data-src], img[src]"))
            )
            
            images = self.driver.find_elements(By.CSS_SELECTOR, "img[data-src], img[src]")
            
            image_urls = []
            for img in images[:10]:  # Get first 10 images
                try:
                    url = img.get_attribute("data-src") or img.get_attribute("src")
                    if url and url.startswith("http") and "base64" not in url:
                        image_urls.append(url)
                except Exception as e:
                    continue
                    
            return image_urls
            
        except TimeoutException:
            print(f"Timeout waiting for images to load for: {search_term}")
            return []
        except Exception as e:
            print(f"Error searching for {search_term}: {str(e)}")
            return []
            
    def download_image(self, url, filename):
        """Download image from URL and save to file"""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            content_type = response.headers.get('content-type', '')
            if not content_type.startswith('image/'):
                return False
                
            with open(filename, 'wb') as f:
                f.write(response.content)
                
            if os.path.exists(filename) and os.path.getsize(filename) > 1000:  # At least 1KB
                return True
            else:
                if os.path.exists(filename):
                    os.remove(filename)
                return False
                
        except Exception as e:
            print(f"Error downloading image from {url}: {str(e)}")
            return False
            
    def get_file_extension(self, url):
        """Extract file extension from URL"""
        parsed = urlparse(url)
        path = parsed.path.lower()
        
        if path.endswith('.jpg') or path.endswith('.jpeg'):
            return '.jpg'
        elif path.endswith('.png'):
            return '.png'
        elif path.endswith('.webp'):
            return '.webp'
        else:
            return '.jpg'  # Default to jpg
            
    def sanitize_filename(self, name):
        """Create a safe filename from part name"""
        safe_name = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).rstrip()
        return safe_name.replace(' ', '_').lower()
        
    def scrape_part_image(self, part_name):
        """Scrape and download the best image for a specific part"""
        search_term = SEARCH_TERMS.get(part_name, f"{part_name} aftermarket car part")
        print(f"Searching for: {part_name} (query: {search_term})")
        
        image_urls = self.search_google_images(search_term)
        
        if not image_urls:
            print(f"No images found for {part_name}")
            return None
            
        safe_name = self.sanitize_filename(part_name)
        
        for i, url in enumerate(image_urls[:5]):  # Try first 5 images
            try:
                extension = self.get_file_extension(url)
                filename = os.path.join(self.output_dir, f"{safe_name}{extension}")
                
                if self.download_image(url, filename):
                    print(f"Successfully downloaded image for {part_name}: {filename}")
                    return filename
                else:
                    print(f"Failed to download image {i+1} for {part_name}")
                    
            except Exception as e:
                print(f"Error processing image {i+1} for {part_name}: {str(e)}")
                continue
                
        print(f"Could not download any suitable image for {part_name}")
        return None
        
    def scrape_all_parts(self):
        """Scrape images for all parts in the list"""
        self.setup_driver()
        
        results = {}
        failed_parts = []
        
        try:
            for i, part in enumerate(AUTOMOTIVE_PARTS, 1):
                print(f"\n[{i}/{len(AUTOMOTIVE_PARTS)}] Processing: {part}")
                
                filename = self.scrape_part_image(part)
                if filename:
                    results[part] = filename
                else:
                    failed_parts.append(part)
                    
                time.sleep(2)
                
        finally:
            if self.driver:
                self.driver.quit()
                
        return results, failed_parts
        
    def generate_report(self, results, failed_parts):
        """Generate a report of the scraping results"""
        report = []
        report.append("PartsGuess Image Scraping Report")
        report.append("=" * 40)
        report.append(f"Total parts: {len(AUTOMOTIVE_PARTS)}")
        report.append(f"Successfully downloaded: {len(results)}")
        report.append(f"Failed: {len(failed_parts)}")
        report.append("")
        
        if results:
            report.append("Successfully downloaded images:")
            for part, filename in results.items():
                report.append(f"  ✓ {part} -> {filename}")
            report.append("")
            
        if failed_parts:
            report.append("Failed to download:")
            for part in failed_parts:
                report.append(f"  ✗ {part}")
            report.append("")
            
        return "\n".join(report)

def main():
    """Main function to run the scraper"""
    print("Starting PartsGuess Image Scraper...")
    print(f"Will scrape images for {len(AUTOMOTIVE_PARTS)} automotive parts")
    
    scraper = PartsImageScraper()
    results, failed_parts = scraper.scrape_all_parts()
    
    report = scraper.generate_report(results, failed_parts)
    print("\n" + report)
    
    with open("scraping_report.txt", "w") as f:
        f.write(report)
        
    print(f"\nScraping complete! Report saved to scraping_report.txt")
    print(f"Images saved to: {scraper.output_dir}/")

if __name__ == "__main__":
    main()
