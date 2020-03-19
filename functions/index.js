const admin = require('firebase-admin')
const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const Fuse = require('fuse.js')

admin.initializeApp()
const db = admin.firestore()

const app = express()
app.use(cors())

const fuzzySearchOptions = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        { name: 'title', weight: 0.3 },
        { name: 'author', weight: 0.2 },
        { name: 'layout', weight: 0.2 },
        { name: 'edition', weight: 0.1 },
        { name: 'tags', weight: 0.1 },
        { name: 'type', weight: 0.1 },
    ]
};

let articles

async function verifyToken(req, res, next) {
    try {
        const token = (req.get('Authorization') || '').replace('Bearer ', '')
        await admin.auth().verifyIdToken(token)
        return next()
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
}

app.get('/', verifyToken, async (request, response) => {
    try {
        const searchString = request.query.searchString
        if (!articles) {
            // If local in-memory cache is empty, we need to query the Firestore database
            articles = []
            const articlesRef = db.collection('articles');

            const query = await articlesRef.get()
            query.docs.forEach(doc => articles.push(doc.data()));
        }

        const fuse = new Fuse(articles, fuzzySearchOptions);
        const result = fuse.search(searchString);

        response.json({ articles: result });
    } catch (error) {
        response.status(500).json({ message: error.toString() })
    }
})

exports.search = functions.https.onRequest((request, response) => app(request, response));
