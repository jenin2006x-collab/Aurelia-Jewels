import time
import os
import shutil
from playwright.sync_api import sync_playwright
import imageio_ffmpeg

os.makedirs("videos", exist_ok=True)
ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

print("Launching browser with Playwright...")
with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        headless=True,
        args=["--hide-scrollbars", "--disable-gpu"]
    )
    
    context = browser.new_context(
        viewport={"width": 1280, "height": 720},
        record_video_dir="videos",
        record_video_size={"width": 1280, "height": 720}
    )
    
    page = context.new_page()
    
    # Helper for smooth scrolling
    def smooth_scroll(distance, steps=10, delay=0.08):
        step_dist = distance / steps
        for _ in range(steps):
            page.evaluate(f"window.scrollBy(0, {step_dist})")
            time.sleep(delay)

    # 1. Homepage & Hero
    print("1. Loading Homepage...")
    page.goto("http://localhost:5500/index.html", wait_until="networkidle")
    time.sleep(2.5)
    
    # Hero Carousel next slide
    next_btn = page.query_selector(".carousel-btn.next, .hero-next, .carousel-control-next")
    if next_btn:
        next_btn.click()
        time.sleep(2)
    else:
        time.sleep(1.5)

    # Scroll down to Collections
    print("Scrolling to Collections...")
    smooth_scroll(450, steps=12, delay=0.06)
    time.sleep(2)

    # Scroll down to Featured / Trending Masterpieces
    print("Scrolling to Trending Masterpieces...")
    smooth_scroll(600, steps=12, delay=0.06)
    time.sleep(2)

    # Hover on first product card
    prod_cards = page.query_selector_all(".product-card")
    if prod_cards:
        prod_cards[0].hover()
        time.sleep(1.5)

    # 2. Products Page & Filters
    print("2. Navigating to Products Catalog...")
    page.goto("http://localhost:5500/products.html", wait_until="networkidle")
    time.sleep(2)

    # Smooth scroll through catalog
    smooth_scroll(350, steps=8, delay=0.06)
    time.sleep(1.5)

    # Click a category or filter if available
    cat_links = page.query_selector_all(".filter-btn, .category-pill, .filter-chip, a[data-category]")
    if cat_links and len(cat_links) > 1:
        cat_links[1].click()
        time.sleep(2)

    # 3. Product Detail Page
    print("3. Opening Product Detail...")
    first_item = page.query_selector(".product-card a, .product-card")
    if first_item:
        first_item.click()
        time.sleep(2)
    else:
        page.goto("http://localhost:5500/product-detail.html?id=1", wait_until="networkidle")
        time.sleep(2)

    # Scroll down on detail page
    smooth_scroll(300, steps=6, delay=0.06)
    time.sleep(1.5)

    # Click Add to Cart
    add_btn = page.query_selector(".btn-add-cart, #addToCartBtn, button:has-text('Add to Cart')")
    if add_btn:
        add_btn.click()
        time.sleep(1.5)

    # 4. Cart Page
    print("4. Opening Cart...")
    page.goto("http://localhost:5500/cart.html", wait_until="networkidle")
    time.sleep(2.5)

    # 5. Checkout Page
    print("5. Opening Checkout...")
    page.goto("http://localhost:5500/checkout.html", wait_until="networkidle")
    time.sleep(2.5)
    smooth_scroll(300, steps=6, delay=0.06)
    time.sleep(1.5)

    # 6. Admin Portal
    print("6. Navigating to Admin Dashboard...")
    page.goto("http://localhost:5500/admin/index.html", wait_until="networkidle")
    time.sleep(3)
    smooth_scroll(400, steps=8, delay=0.06)
    time.sleep(2.5)

    print("Finishing recording session...")
    page.close()
    video_path = page.video.path()
    context.close()
    browser.close()

print("Raw video saved at:", video_path)

# Convert webm to optimized mp4 with ffmpeg
output_mp4 = os.path.abspath("aurelia_jewels_demo.mp4")
cmd = f'"{ffmpeg_exe}" -y -i "{video_path}" -c:v libx264 -pix_fmt yuv420p -r 30 -movflags +faststart "{output_mp4}"'
print("Converting to MP4:", cmd)
os.system(cmd)

print("Demo video successfully generated at:", output_mp4)
