# jquery.theawesomeshadow
jQuery plugin for shadow scroll animation

For example look at index.html


// Set Options
var options = {
        minshadow: 5,                   // Min Shadow
        maxshadow: 45,                  // Max Shadow
        zoom: 1.019,                    // Scale/Zoom
        tweak: -300,                    // Tweak (When animation starts and stops)
        shadowcolor: 'rgba(0,0,0,0.4)', // Shadow Color
        shadowLeftRight: 0,             // Shadow Horizontal Length
        shadowTopBottom: 2              // Shadow Vertical Length
    };

// Init jquery.theawesomeshadow
$('.card').theAwesomeShadow(options);
