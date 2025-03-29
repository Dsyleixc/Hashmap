'use strict';

class HashMap {
    constructor(capacity, loadfactor) {
        this.capacity = capacity;
        this.loadfactor = loadfactor;
        this.size = 0;
        this.buckets = Array.from({ length: capacity }, () => null);
    }

    #hash(key) {
        let hashCode = 0;

        const primeNumber = 31;
        for (let i = 0; i < key.length; i++) {
            hashCode = primeNumber * hashCode + key.charCodeAt(i);
        }

        return hashCode;
    }

    #placeNode(node) {
        // Hash the node
        const hashedIndex = this.#hash(node.key) % this.capacity;

        // if bucket is empty then set it
        if (this.buckets[hashedIndex] === null) {
            this.buckets[hashedIndex] = node;
            this.size++;
            return;
        }

        // travel through linked lists to get to last one
        let current = this.buckets[hashedIndex];
        let prev = current; // Add this
        while (current !== null) {
            if (current.key === node.key) {
                current.value = node.value; // updates value if key matches
                return;
            }
            prev = current; // Keep track of last non-null node
            current = current.nextNode;
        }
        prev.nextNode = node;
        this.size++;
    }

    set(key, value) {
        // Check if need to expand
        if (this.size / this.capacity > this.loadfactor) {
            this.capacity *= 2;
            const oldBucket = structuredClone(this.buckets);
            this.buckets = Array.from({ length: this.capacity }, () => null);
            this.size = 0; // Reset size since placeNode will increment it

            // Go through each bucket
            for (let bucket of oldBucket) {
                if (bucket === null) continue;

                // Handle the first node and all chained nodes
                let current = bucket;
                while (current !== null) {
                    this.#placeNode(new Node(current.key, current.value));
                    current = current.nextNode;
                }
            }
        }

        // Hash the items
        let node = new Node(key, value);
        this.#placeNode(node);
    }

    get(key) {
        const hashedIndex = this.#hash(key) % this.capacity;

        if (this.buckets[hashedIndex] === null) return null;

        let current = this.buckets[hashedIndex];
        while (current !== null) {
            if (current.key === key) return current.value;
            current = current.nextNode;
        }
        return null;
    }

    has(key) {
        if (this.get(key) !== null) return true;
        return false;
    }

    remove(key) {
        const hashedIndex = this.#hash(key) % this.capacity;

        if (!this.buckets[hashedIndex]) return false;

        let before = null;
        let current = this.buckets[hashedIndex];
        let after = current.nextNode;

        // if first node and is only node then set to null
        if (current.key === key && current.nextNode === null) {
            this.buckets[hashedIndex] = null;
            this.size--;
            return true;
        }

        // if first node and has next node set 2nd chain to head
        if (current.key === key && current.nextNode) {
            this.buckets[hashedIndex] = current.nextNode;
            this.size--;
            return true;
        }

        // if its in middle then set chain before's nextNode to be chain after
        while (current !== null) {
            // if its in the middle then before chain and after chain need to link
            if (after && current.key === key) {
                before.nextNode = after;
                this.size--;
                return true;
            }

            // if its last chain set prev chains next node to be null
            if (after === null && current.key === key) {
                before.nextNode = null;
                this.size--;
                return true;
            }

            before = current;
            current = after;
            after = after ? after.nextNode : null;
        }
        return false;
    }

    length() {
        return this.size;
    }

    clear() {
        this.buckets = Array.from({ length: this.capacity }, () => null);
        this.size = 0;
    }

    keys() {
        const array = [];

        for (let node of this.buckets) {
            if (node === null) continue;

            let current = node;
            while (current) {
                array.push(current.key);
                current = current.nextNode;
            }
        }

        return array;
    }

    values() {
        const array = [];

        for (let node of this.buckets) {
            if (node === null) continue;

            let current = node;
            while (current) {
                array.push(current.value);
                current = current.nextNode;
            }
        }

        return array;
    }

    entries() {
        const array = [];

        for (let node of this.buckets) {
            if (node === null) continue;

            let current = node;
            while (current) {
                let pair = [current.key, current.value];
                array.push(pair);
                current = current.nextNode;
            }
        }

        return array;
    }
}

class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.nextNode = null;
    }
}
