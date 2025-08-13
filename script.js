const campusLocations = {
            academic: [
                {name: "Academic Block 1", category: "academic", status: "open", hours: "8:00 AM - 8:00 PM", x: 15, y: 20, width: 80, height: 60, description: "Main academic building with engineering departments"},
                {name: "Academic Block 2", category: "academic", status: "open", hours: "8:00 AM - 8:00 PM", x: 200, y: 30, width: 70, height: 50, description: "Computer Science and IT departments"},
                {name: "Academic Block 3", category: "academic", status: "open", hours: "8:00 AM - 8:00 PM", x: 300, y: 40, width: 65, height: 45, description: "Management and Liberal Arts"},
                {name: "Central Library", category: "academic", status: "open", hours: "7:00 AM - 10:00 PM", x: 450, y: 60, width: 90, height: 70, description: "24/7 digital library with study areas"},
                {name: "Lecture Hall Complex", category: "academic", status: "open", hours: "9:00 AM - 6:00 PM", x: 100, y: 150, width: 100, height: 40, description: "Lecture Halls"}
            ],
            hostels: [
                {name: "Boys Hostel 1", category: "hostels", status: "open", hours: "24/7", x: 50, y: 300, width: 60, height: 80, description: "Accommodation for 200 students"},
                {name: "Boys Hostel 2", category: "hostels", status: "open", hours: "24/7", x: 150, y: 320, width: 60, height: 75, description: "Accommodation for 180 students"},
                {name: "Girls Hostel 1", category: "hostels", status: "open", hours: "24/7", x: 300, y: 280, width: 70, height: 85, description: "Accommodation for 220 students"},
                {name: "Girls Hostel 2", category: "hostels", status: "closed", hours: "Under Construction", x: 400, y: 300, width: 65, height: 80, description: "New hostel block - opening soon"}
            ],
            dining: [
                {name: "Main Cafeteria", category: "dining", status: "open", hours: "7:00 AM - 10:00 PM", x: 250, y: 150, width: 70, height: 50, description: "Multi-cuisine dining hall"},
                {name: "Food Court", category: "dining", status: "open", hours: "10:00 AM - 11:00 PM", x: 350, y: 180, width: 60, height: 40, description: "Fast food and snacks"},
                {name: "Coffee Shop", category: "dining", status: "maintenance", hours: "Temporarily closed", x: 500, y: 200, width: 40, height: 30, description: "Coffee and light refreshments"}
            ],
            admin: [
                {name: "Administrative Block", category: "admin", status: "open", hours: "9:00 AM - 5:00 PM", x: 400, y: 20, width: 80, height: 55, description: "Main administrative offices"},
                {name: "Registrar Office", category: "admin", status: "open", hours: "9:00 AM - 4:00 PM", x: 500, y: 100, width: 50, height: 35, description: "Student records and documentation"},
                {name: "Finance Office", category: "admin", status: "closed", hours: "Weekends Closed", x: 480, y: 150, width: 45, height: 30, description: "Fee payments and financial services"}
            ],
            recreation: [
                {name: "Sports Complex", category: "recreation", status: "open", hours: "6:00 AM - 10:00 PM", x: 30, y: 400, width: 120, height: 60, description: "Gymnasium, courts, and fitness center"},
                {name: "Swimming Pool", category: "recreation", status: "open", hours: "6:00 AM - 8:00 PM", x: 200, y: 420, width: 80, height: 40, description: "Olympic size swimming pool"},
                {name: "Auditorium", category: "recreation", status: "open", hours: "Event based", x: 350, y: 380, width: 90, height: 50, description: "Main auditorium for events and seminars"},
                {name: "Student Activity Center", category: "recreation", status: "open", hours: "9:00 AM - 9:00 PM", x: 480, y: 350, width: 70, height: 60, description: "Clubs and student activities"}
            ]
        };

        let allLocations = [];
        let selectedLocation = null;
        let routeStartPoint = null;
        let routeEndPoint = null;
        let currentRoute = null;

        // Initialize the application
        function init() {
            // Flatten all locations into a single array
            Object.values(campusLocations).forEach(category => {
                allLocations = allLocations.concat(category);
            });

            renderCampusMap();
            updateLocationList('all');
            updateStatusBar();
            setupSearchFunctionality();
        }

        // Render all campus areas on the map
        function renderCampusMap() {
            const mapElement = document.getElementById('campusMap');
            
            allLocations.forEach((location, index) => {
                const areaElement = document.createElement('div');
                areaElement.className = 'campus-area';
                areaElement.id = `location-${index}`;
                areaElement.style.left = `${location.x}px`;
                areaElement.style.top = `${location.y}px`;
                areaElement.style.width = `${location.width}px`;
                areaElement.style.height = `${location.height}px`;
                areaElement.textContent = location.name;
                
                // Add status-based styling
                if (location.status === 'maintenance') {
                    areaElement.style.opacity = '0.6';
                    areaElement.style.borderColor = '#ff6b6b';
                } else if (location.status === 'closed') {
                    areaElement.style.opacity = '0.7';
                    areaElement.style.borderColor = '#ffc107';
                }

                areaElement.addEventListener('click', () => selectLocation(location, index));
                areaElement.addEventListener('mouseenter', (e) => showPopup(location, e));
                areaElement.addEventListener('mouseleave', closePopup);

                mapElement.appendChild(areaElement);
            });
        }

        // Handle location selection
        function selectLocation(location, index) {
            // Clear previous selection
            document.querySelectorAll('.campus-area').forEach(el => {
                el.classList.remove('highlighted');
            });

            // Highlight selected location
            const element = document.getElementById(`location-${index}`);
            element.classList.add('highlighted');
            
            selectedLocation = {location, index};

            // If this is the second selection, create a route
            if (routeStartPoint && routeStartPoint.index !== index) {
                routeEndPoint = selectedLocation;
                createRoute();
            } else {
                routeStartPoint = selectedLocation;
                clearRoute();
            }
        }

        // Create a route between two points
        function createRoute() {
            if (!routeStartPoint || !routeEndPoint) return;

            const start = routeStartPoint.location;
            const end = routeEndPoint.location;
            
            // Simple route calculation (straight line for demo)
            const startX = start.x + start.width / 2;
            const startY = start.y + start.height / 2;
            const endX = end.x + end.width / 2;
            const endY = end.y + end.height / 2;
            
            const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

            // Remove existing route
            const existingRoute = document.querySelector('.route-path');
            if (existingRoute) {
                existingRoute.remove();
            }

            // Create route element
            const routeElement = document.createElement('div');
            routeElement.className = 'route-path';
            routeElement.style.left = `${startX}px`;
            routeElement.style.top = `${startY}px`;
            routeElement.style.width = `${distance}px`;
            routeElement.style.transform = `rotate(${angle}deg)`;
            routeElement.style.transformOrigin = '0 50%';

            document.getElementById('campusMap').appendChild(routeElement);
            
            // Show route controls
            const routeControls = document.getElementById('routeControls');
            const routeDetails = document.getElementById('routeDetails');
            routeControls.classList.add('show');
            routeDetails.textContent = `${start.name} → ${end.name} (${Math.round(distance/10)} min walk)`;
            
            currentRoute = routeElement;
        }

        // Clear the current route
        function clearRoute() {
            if (currentRoute) {
                currentRoute.remove();
                currentRoute = null;
            }
            
            document.getElementById('routeControls').classList.remove('show');
            routeStartPoint = null;
            routeEndPoint = null;
        }

        // Show location popup
        function showPopup(location, event) {
            const popup = document.getElementById('infoPopup');
            const title = document.getElementById('popupTitle');
            const details = document.getElementById('popupDetails');
            
            title.textContent = location.name;
            details.innerHTML = `
                <strong>Status:</strong> ${location.status.charAt(0).toUpperCase() + location.status.slice(1)}<br>
                <strong>Hours:</strong> ${location.hours}<br>
                <strong>Description:</strong> ${location.description}
            `;
            
            const rect = event.target.getBoundingClientRect();
            popup.style.left = `${rect.right + 10}px`;
            popup.style.top = `${rect.top}px`;
            popup.classList.add('show');
        }

        // Close popup
        function closePopup() {
            document.getElementById('infoPopup').classList.remove('show');
        }

        // Filter locations by category
        function filterCategory(category) {
            // Update active button
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            updateLocationList(category);
        }

        // Update the location list based on category
        function updateLocationList(category) {
            const locationList = document.getElementById('locationList');
            locationList.innerHTML = '';
            
            let locationsToShow = allLocations;
            if (category !== 'all') {
                locationsToShow = allLocations.filter(loc => loc.category === category);
            }
            
            locationsToShow.forEach((location, index) => {
                const item = document.createElement('div');
                item.className = 'location-item';
                item.innerHTML = `
                    <strong>${location.name}</strong><br>
                    <small>Status: ${location.status} | ${location.hours}</small>
                `;
                item.onclick = () => {
                    const globalIndex = allLocations.indexOf(location);
                    selectLocation(location, globalIndex);
                };
                locationList.appendChild(item);
            });
        }

        // Search functionality
        function setupSearchFunctionality() {
            const searchInput = document.getElementById('searchInput');
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchLocation();
                }
            });
        }

        // Search for locations
        function searchLocation() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            if (!searchTerm) return;
            
            const matches = allLocations.filter(location => 
                location.name.toLowerCase().includes(searchTerm) ||
                location.description.toLowerCase().includes(searchTerm) ||
                location.category.toLowerCase().includes(searchTerm)
            );
            
            if (matches.length > 0) {
                const firstMatch = matches[0];
                const index = allLocations.indexOf(firstMatch);
                selectLocation(firstMatch, index);
                
                // Scroll to the location on map (visual feedback)
                const element = document.getElementById(`location-${index}`);
                element.scrollIntoView({behavior: 'smooth', block: 'center'});
                
                // Show search results in location list
                const locationList = document.getElementById('locationList');
                locationList.innerHTML = '';
                
                matches.forEach(location => {
                    const item = document.createElement('div');
                    item.className = 'location-item';
                    item.innerHTML = `
                        <strong>${location.name}</strong><br>
                        <small>${location.description}</small>
                    `;
                    item.onclick = () => {
                        const globalIndex = allLocations.indexOf(location);
                        selectLocation(location, globalIndex);
                    };
                    locationList.appendChild(item);
                });
            } else {
                alert('No locations found matching your search.');
            }
        }

        // Update status bar with current statistics
        function updateStatusBar() {
            const total = allLocations.length;
            const open = allLocations.filter(loc => loc.status === 'open').length;
            const closed = allLocations.filter(loc => loc.status === 'closed').length;
            const maintenance = allLocations.filter(loc => loc.status === 'maintenance').length;
            
            document.getElementById('totalLocations').textContent = total;
            document.getElementById('openFacilities').textContent = open;
            document.getElementById('closedFacilities').textContent = closed;
            document.getElementById('maintenanceFacilities').textContent = maintenance;
        }

        // Add some interactive features
        document.addEventListener('DOMContentLoaded', function() {
            init();
            
            // Add keyboard shortcuts
            document.addEventListener('keydown', function(e) {
                if (e.ctrlKey && e.key === 'f') {
                    e.preventDefault();
                    document.getElementById('searchInput').focus();
                }
                if (e.key === 'Escape') {
                    clearRoute();
                    closePopup();
                    document.querySelectorAll('.campus-area').forEach(el => {
                        el.classList.remove('highlighted');
                    });
                }
            });
            
            // Simulate real-time updates (in a real app, this would come from a server)
            setInterval(() => {
                // Randomly update one facility status (demo only)
                if (Math.random() < 0.1) { // 10% chance every interval
                    const randomLocation = allLocations[Math.floor(Math.random() * allLocations.length)];
                    const statuses = ['open', 'closed', 'maintenance'];
                    const currentStatus = randomLocation.status;
                    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                    
                    if (currentStatus !== newStatus) {
                        randomLocation.status
                    }
                }
            }, 1000);
        });
