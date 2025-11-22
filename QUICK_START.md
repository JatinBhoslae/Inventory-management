# Quick Start Guide - Advanced Features

## Accessing Advanced Features

1. **Login to StockMaster**
   - Navigate to the login page
   - Use your credentials to access the system

2. **Navigate to Advanced Features**
   - Click "Advanced Features" in the main navigation menu
   - Or go directly to `/advanced`

---

## Feature 1: AI Demand Forecasting

### What It Does
Predicts when products will run out of stock based on historical consumption patterns.

### How to Use
1. Click the **"AI Forecasting"** tab
2. View forecast cards for each product showing:
   - Current stock level
   - Average daily consumption
   - Days until stockout
   - Consumption trend (increasing/decreasing/stable)
   - Confidence level

### Understanding the Display
- **Red cards**: Critical - will run out in < 7 days
- **Yellow cards**: Warning - will run out in 7-14 days
- **Green cards**: Healthy - sufficient stock
- **Trend arrows**: ↑ Increasing consumption, ↓ Decreasing, → Stable

### Tips
- Forecasts improve with more historical data
- High confidence predictions are more reliable
- Use predictions to plan reorders proactively

---

## Feature 2: QR Code System

### What It Does
Generate QR codes for products and scan them with your device camera.

### How to Use

#### Generating QR Codes
1. Click the **"QR Codes"** tab
2. Select a product from the list on the right
3. View the generated QR code
4. Click **"Download QR Code"** to save as PNG image
5. Print and attach to physical products or racks

#### Scanning QR Codes
1. Click **"Scan QR Code"** button
2. Allow camera permissions when prompted
3. Click **"Start Camera"**
4. Point camera at QR code
5. Product details will appear automatically

### Tips
- Print QR codes on durable labels
- Place QR codes at eye level for easy scanning
- Use mobile devices for scanning while moving around warehouse
- QR codes work offline once generated

---

## Feature 3: Warehouse Heatmap

### What It Does
Visual 2D grid showing warehouse rack utilization and activity patterns.

### How to Use
1. Click the **"Warehouse Map"** tab
2. Choose view mode:
   - **Utilization**: Shows how full each rack is
   - **Activity**: Shows movement frequency

#### Utilization View
- **Gray**: < 30% full (underutilized)
- **Green**: 30-50% full (optimal)
- **Yellow**: 50-70% full (getting full)
- **Orange**: 70-90% full (nearly full)
- **Red**: > 90% full (critical)

#### Activity View
- **Gray**: < 5 movements (low activity)
- **Light Blue**: 5-10 movements
- **Medium Blue**: 10-15 movements
- **Blue**: 15-20 movements
- **Dark Blue**: > 20 movements (high activity)

### Interacting with the Heatmap
- Click any rack to see detailed information:
  - Capacity
  - Current stock
  - Utilization percentage
  - Movement frequency
  - List of products in that rack

### Tips
- Use utilization view to identify overcrowded racks
- Use activity view to optimize warehouse layout
- Place high-activity items near shipping areas
- Redistribute stock from red (critical) racks

---

## Feature 4: Voice Commands

### What It Does
Control StockMaster hands-free using voice commands.

### How to Use
1. Click the **"Voice Control"** tab
2. Allow microphone permissions when prompted
3. Click the large microphone button
4. Speak your command clearly
5. Wait for system confirmation
6. Click again to stop listening

### Supported Commands

#### Check Stock
- "Check stock of Steel Rods"
- "Check availability for Bolts"

#### Create Operations
- "Create receipt for 50 units of Screws"
- "Create delivery for 20 units of Nuts"

#### Navigation
- "Show dashboard"
- "Go to products"
- "Show low stock alerts"

### Tips for Best Results
- Speak clearly at normal pace
- Use exact product names
- Minimize background noise
- Wait for beep before speaking
- One command at a time
- Grant microphone permissions

### Browser Compatibility
- ✅ Chrome (recommended)
- ✅ Edge
- ✅ Safari
- ❌ Firefox (not supported)

---

## Troubleshooting

### Camera Not Working
- Check browser permissions (Settings → Privacy → Camera)
- Ensure no other app is using the camera
- Try refreshing the page
- Use Chrome or Safari for best compatibility

### Microphone Not Working
- Check browser permissions (Settings → Privacy → Microphone)
- Ensure microphone is not muted
- Try a different browser (Chrome recommended)
- Check system microphone settings

### QR Code Not Scanning
- Ensure good lighting
- Hold camera steady
- Position QR code within the frame
- Try uploading QR code image instead

### Voice Commands Not Recognized
- Speak more clearly
- Use exact product names from your inventory
- Check microphone volume
- Reduce background noise

### Forecasts Not Showing
- Ensure you have products in the system
- Create some stock movements (receipts, deliveries)
- Wait for at least a few days of data
- Check that stock ledger has entries

---

## Best Practices

### For Warehouse Staff
1. **Use QR codes** for quick product identification
2. **Use voice commands** when hands are full
3. **Check heatmap** before storing new items
4. **Review forecasts** daily for reorder planning

### For Managers
1. **Monitor forecasts** to prevent stockouts
2. **Analyze heatmap** to optimize warehouse layout
3. **Generate QR codes** for all new products
4. **Train staff** on voice commands

### For Administrators
1. **Print QR codes** for all products
2. **Set up warehouse grid** in heatmap
3. **Review forecast accuracy** regularly
4. **Optimize based on insights**

---

## Getting Help

### Documentation
- `ADVANCED_FEATURES.md` - Detailed technical documentation
- `FEATURE_SUMMARY.md` - Implementation overview
- `README.md` - General system documentation

### Support
- Check browser console for error messages
- Verify permissions for camera and microphone
- Ensure you're using a supported browser
- Test with sample data first

---

## Next Steps

1. **Explore each feature** in the Advanced Features page
2. **Generate QR codes** for your products
3. **Review AI forecasts** for reorder planning
4. **Optimize warehouse** using heatmap insights
5. **Train staff** on voice commands

---

## Tips for Maximum Impact

### For Demonstrations
1. Start with **AI Forecasting** - shows intelligence
2. Demo **QR scanning** with phone - shows hardware integration
3. Show **Heatmap** - impressive visualization
4. End with **Voice commands** - wow factor

### For Academic Projects
- Highlight the AI/ML aspects of forecasting
- Emphasize hardware integration (camera, mic)
- Showcase data visualization skills
- Demonstrate full-stack capabilities

### For Job Interviews
- Explain the problem each feature solves
- Discuss technical implementation choices
- Show how features integrate with existing system
- Highlight user experience considerations

---

Enjoy your AI-powered warehouse management system! 🚀
