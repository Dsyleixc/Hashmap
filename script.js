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
            return;
        }

        // travel through linked lists to get to last one
        let current = this.buckets[hashedIndex];
        while (current !== null) {
            if (current.key === node.key) {
                current.value = node.value;
                return;
            }
            current = current.nextNode;
        }
        current.nextNode = node;
    }

    set(key, value) {
        // Check if need to expand
        if (this.size / this.capacity > this.loadfactor) {
            this.capacity *= 2;
            // shallow copy bucket
            const oldBucket = structuredClone(this.buckets);
            this.buckets = Array.from({ length: this.capacity }, () => null);

            for (let node of oldBucket) {
                // skip if bucket is null
                if (node === null) continue;

                this.#placeNode(node);
                // if something exists replace node
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
        if (!this.has(key)) return false;

        const hashedIndex = this.#hash(key) % this.capacity;
        let before;
        let current = this.buckets[hashedIndex];
        let after = current.nextNode;

        // if first node and is only node then set to null
        if (current.key === key && current.nextNode === null) {
            this.buckets[hashedIndex] = null;
            return true;
        }

        // if first node and has next node set 2nd chain to head
        if (current.key === key && current.nextNode) {
            this.buckets[hashedIndex] = current.nextNode;
        }

        // if its in middle then set chain before's nextNode to be chain after
        while (current !== null) {
            // if its last chain set prev chains next node to be null
            if (after === null) {
                before.currentNode = null;
            }
        }
    }
}

class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.nextNode = null;
    }
}
