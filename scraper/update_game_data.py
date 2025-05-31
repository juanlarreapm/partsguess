#!/usr/bin/env python3
"""
Script to generate updated game data for PartsGuess using the scraped images
"""

from parts_list import AUTOMOTIVE_PARTS

def generate_game_data():
    """Generate JavaScript game data array for the PartsGuess game"""
    
    options_map = {
        "Engine Oil Filter": ["Engine Oil Filter", "Fuel Filter", "Air Filter", "Transmission Filter"],
        "Disc Brake Pad Set": ["Disc Brake Pad Set", "Drum Brake Shoes", "Brake Rotors", "Brake Calipers"],
        "Disc Brake Rotor": ["Disc Brake Rotor", "Brake Drum", "Flywheel", "Clutch Disc"],
        "Air Filter": ["Air Filter", "Cabin Air Filter", "Oil Filter", "Fuel Filter"],
        "Spark Plug": ["Spark Plug", "Glow Plug", "Ignition Coil", "Fuel Injector"],
        "Cabin Air Filter": ["Cabin Air Filter", "Engine Air Filter", "HVAC Filter", "Oil Filter"],
        "Serpentine Belt": ["Serpentine Belt", "Timing Belt", "V-Belt", "Drive Chain"],
        "Vehicle Battery": ["Vehicle Battery", "Alternator", "Starter Motor", "Capacitor"],
        "Wiper Blade": ["Wiper Blade", "Wiper Motor", "Wiper Arm", "Windshield Washer Pump"],
        "Suspension Shock Absorber": ["Suspension Shock Absorber", "Coil Spring", "Strut Mount", "Sway Bar"],
        "Automatic Transmission Fluid": ["Automatic Transmission Fluid", "Engine Oil", "Power Steering Fluid", "Brake Fluid"],
        "Disc Brake Caliper": ["Disc Brake Caliper", "Brake Master Cylinder", "Brake Booster", "ABS Module"],
        "Engine Oil": ["Engine Oil", "Transmission Fluid", "Coolant", "Power Steering Fluid"],
        "Suspension Stabilizer Bar Link": ["Suspension Stabilizer Bar Link", "Tie Rod End", "Ball Joint", "Control Arm Bushing"],
        "Suspension Strut and Coil Spring Assembly": ["Suspension Strut and Coil Spring Assembly", "Shock Absorber", "Leaf Spring", "Torsion Bar"],
        "Engine Coolant / Antifreeze": ["Engine Coolant / Antifreeze", "Engine Oil", "Transmission Fluid", "Windshield Washer Fluid"],
        "Suspension Control Arm": ["Suspension Control Arm", "Tie Rod", "Sway Bar", "Strut Assembly"],
        "CV Axle Assembly": ["CV Axle Assembly", "Drive Shaft", "Axle Shaft", "Universal Joint"],
        "Wheel Bearing and Hub Assembly": ["Wheel Bearing and Hub Assembly", "Brake Hub", "Wheel Stud", "Lug Nut"],
        "Engine Valve Cover Gasket Set": ["Engine Valve Cover Gasket Set", "Head Gasket", "Oil Pan Gasket", "Intake Manifold Gasket"]
    }
    
    descriptions = {
        "Engine Oil Filter": "Removes contaminants from engine oil to keep the engine running smoothly and extend its life.",
        "Disc Brake Pad Set": "Friction material that presses against brake rotors to slow down or stop the vehicle.",
        "Disc Brake Rotor": "Metal disc that brake pads clamp down on to create friction and stop the vehicle.",
        "Air Filter": "Filters air entering the engine to prevent dirt and debris from causing damage.",
        "Spark Plug": "Ignites the air-fuel mixture in the engine's combustion chamber to power the vehicle.",
        "Cabin Air Filter": "Filters air entering the passenger compartment through the HVAC system.",
        "Serpentine Belt": "Single belt that drives multiple engine accessories like the alternator, power steering, and A/C.",
        "Vehicle Battery": "Provides electrical power to start the engine and run electrical systems when the engine is off.",
        "Wiper Blade": "Rubber blade that clears water and debris from the windshield for clear visibility.",
        "Suspension Shock Absorber": "Dampens suspension movement to provide a smooth ride and maintain tire contact with the road.",
        "Automatic Transmission Fluid": "Lubricates and cools automatic transmission components while enabling gear changes.",
        "Disc Brake Caliper": "Houses brake pads and uses hydraulic pressure to squeeze them against the brake rotor.",
        "Engine Oil": "Lubricates engine components, reduces friction, and helps regulate engine temperature.",
        "Suspension Stabilizer Bar Link": "Connects the stabilizer bar to the suspension to reduce body roll during cornering.",
        "Suspension Strut and Coil Spring Assembly": "Complete suspension unit that supports vehicle weight and absorbs road impacts.",
        "Engine Coolant / Antifreeze": "Liquid that circulates through the engine to regulate temperature and prevent freezing.",
        "Suspension Control Arm": "Connects the wheel hub to the vehicle frame and allows controlled wheel movement.",
        "CV Axle Assembly": "Transfers power from the transmission to the wheels while allowing for steering and suspension movement.",
        "Wheel Bearing and Hub Assembly": "Allows wheels to rotate smoothly while supporting the vehicle's weight.",
        "Engine Valve Cover Gasket Set": "Seals the valve cover to prevent oil leaks from the top of the engine."
    }
    
    game_data = []
    
    for i, part in enumerate(AUTOMOTIVE_PARTS, 1):
        image_filename = part.lower().replace(' ', '_').replace('/', '_').replace(' / ', '_')
        
        game_data.append({
            "id": i,
            "image": f"/parts-images/{image_filename}.jpg",
            "correctAnswer": part,
            "options": options_map.get(part, [part, "Option 2", "Option 3", "Option 4"]),
            "description": descriptions.get(part, f"An important automotive component: {part}")
        })
    
    return game_data

def format_as_javascript(game_data):
    """Format the game data as JavaScript code"""
    js_code = "// Game data - automotive parts for PartsGuess MVP\nconst gameData = [\n"
    
    for item in game_data:
        js_code += "  {\n"
        js_code += f"    id: {item['id']},\n"
        js_code += f"    image: \"{item['image']}\",\n"
        js_code += f"    correctAnswer: \"{item['correctAnswer']}\",\n"
        js_code += f"    options: {item['options']},\n"
        js_code += f"    description: \"{item['description']}\",\n"
        js_code += "  },\n"
    
    js_code += "]\n"
    return js_code

if __name__ == "__main__":
    game_data = generate_game_data()
    js_code = format_as_javascript(game_data)
    
    with open("updated_game_data.js", "w") as f:
        f.write(js_code)
    
    print("Generated updated game data!")
    print(f"Created {len(game_data)} parts for the game")
    print("File saved as: updated_game_data.js")
