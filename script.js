'use strict';

class HashMap {
    constructor(capacity, loadfactor) {
        this.capacity = capacity;
        this.loadfactor = loadfactor;
        this.size = 0;
        this.buckets = Array.from({ length: capacity }, () => null);
    }

    hash(key) {
        let hashCode = 0;

        const primeNumber = 31;
        for (let i = 0; i < key.length; i++) {
            hashCode = primeNumber * hashCode + key.charCodeAt(i);
        }

        return hashCode;
    }

    set(key, value) {
        // Check if need to expand
        if (this.size / this.capacity > this.loadfactor) {
        }

        // Hash the items
        const hashedIndex = this.hash(key) % this.capacity;
        let node = new Node(key, value);

        if (this.buckets[hashedIndex] === null) {
            this.buckets[hashedIndex] = node;
            return;
        }

        let current = this.buckets[hashedIndex];
        while (current !== null) {
            if (current.key === key) {
                current.value = value;
                return;
            }
            current = current.nextNode;
        }
        current.nextNode = node;
    }
}

class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.nextNode = null;
    }
}
