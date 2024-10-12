// Select all profile cards
var profileCards = document.querySelectorAll('.profile-card');

// Loop through each profile card
document.addEventListener('DOMContentLoaded', function() {
    // Remove duplicate declaration of profileCards variable
    profileCards.forEach(function(card) {
        // Add a click event listener
        card.addEventListener('click', function() {
            // Remove centered class from all cards
            profileCards.forEach(function(card) {
                card.classList.remove('centered');
            });

            // Add centered class to the clicked card
            card.classList.add('centered');
        });
    });
});
