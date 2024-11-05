export const inspiration = [
    "Start a gratitude journal and write down three things you are thankful for each day!",
    "Make a playlist of songs that uplift your spirits and share it with a friend!",
    "Draw or paint a picture that represents your current mood!",
    "Plan a picnic in your backyard or at a nearby park!",
    "Write a short story that begins with the line, 'It was a dark and stormy night...'",
    "Try to go a whole day without complaining and notice how it changes your mindset!",
    "Research a historical figure you admire and write about their impact on the world!",
    "Create a vision board with images and quotes that inspire you!",
    "Take a different route on your daily walk or commute and explore new places!",
    "Write a haiku about your favorite season!",
    "Organize your workspace and see how it affects your productivity!",
    "Host a movie night with friends and watch a genre you've never tried before!",
    "Write a letter to someone who has inspired you, expressing your gratitude!",
    "Plant a small herb garden in your kitchen or balcony!",
    "Challenge yourself to read a book in a genre you usually avoid!",
    "Try a new hobby, like knitting, pottery, or photography!",
    "Spend an hour observing nature and write down what you see, hear, and feel!",
    "Create a personal mission statement that reflects your values and goals!",
    "Start a conversation with a stranger and learn something new!",
    "Plan a themed dinner night at home and cook dishes from a different culture!",
    "Make a list of 10 things that make you happy and incorporate them into your week!",
    "Write a fictional diary entry from the perspective of an inanimate object!",
    "Record a video message for your future self to open in a year!",
    "Choose a random act of kindness to perform for someone today!",
    "Create a collage of images that represent your ideal life!",
    "Try meditating for 10 minutes and notice how it affects your day!",
    "Document your dreams for a week and analyze any recurring themes!",
    "Attend a local event or workshop you've never been to before!",
    "Make a bucket list of experiences you want to have in the next five years!",
    "Write a short script for a scene in a movie you would love to see!",
    "Create a list of your dreams and start taking steps to make them a reality!",
    "Write a letter to yourself five years from now. What do you want to say?",
    "Try cooking a new dish using ingredients you already have at home!",
    "Take a walk around your neighborhood and capture all the beautiful moments you see!",
    "Write a poem about autumn, using all your senses!",
    "Compile a list of your favorite movies and explain why they inspire you!",
    "Plan a technology-free day—just you and your thoughts!",
    "Write a story about a mysterious creature living in your imaginary world!",
    "Try a new sport or physical activity this week!",
    "Create your own dream board using magazines and cutouts!"
];

export function getRandomInspiration() {
    const randomIndex = Math.floor(Math.random() * inspiration.length);
    return inspiration[randomIndex];
}

console.log(getRandomInspiration());
