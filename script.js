class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.frequency = 0; // Priority Queue metric
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (let char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
        node.frequency++; // Increase frequency when inserted
    }

    autoSuggest(prefix) {
        let node = this.root;
        for (let char of prefix) {
            if (!node.children[char]) return [];
            node = node.children[char];
        }
        let results = [];
        this.dfs(node, prefix, results);
        return results.sort((a, b) => b.freq - a.freq).map(item => item.word);
    }

    dfs(node, prefix, results) {
        if (node.isEndOfWord) results.push({ word: prefix, freq: node.frequency });
        for (let char in node.children) {
            this.dfs(node.children[char], prefix + char, results);
        }
    }
}

// Create and populate Trie
const trie = new Trie();
const words = ["apple", "application", "apply", "banana", "bat", "batman", "basket", "car", "cat", "cattle"];
words.forEach(word => trie.insert(word));

function showSuggestions() {
    let input = document.getElementById("searchBox").value.toLowerCase();
    let suggestionBox = document.getElementById("suggestions");
    
    suggestionBox.innerHTML = ""; // Clear previous results
    if (input.length === 0) return;

    let suggestions = trie.autoSuggest(input);
    suggestions.forEach((suggestion, index) => {
        let li = document.createElement("li");
        li.textContent = suggestion;
        li.onclick = () => { document.getElementById("searchBox").value = suggestion; };
        suggestionBox.appendChild(li);

        // GSAP Animation for each suggestion item
        gsap.from(li, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            delay: index * 0.1, // Staggered delay for each item
            ease: "power2.out",
        });
    });
}

// GSAP Animations for the input field
const searchBox = document.getElementById("searchBox");

searchBox.addEventListener("focus", () => {
    gsap.to(searchBox, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
    });
});

searchBox.addEventListener("blur", () => {
    gsap.to(searchBox, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
    });
});

// GSAP Animation for the heading
gsap.from("h1", {
    duration: 1.5,
    y: -50,
    opacity: 0,
    ease: "bounce.out",
});

// GSAP Animation for the input field on page load
gsap.from(searchBox, {
    duration: 1,
    x: -100,
    opacity: 0,
    delay: 0.5,
    ease: "power3.out",
});