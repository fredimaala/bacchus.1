const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Test endpoint
app.get("/", (req, res) => {
  res.send("Bacchus backend on töös!");
});

// Endpoint: Kõigi toodete salvestamine
app.post("/products", async (req, res) => {
  try {
    const products = req.body;
    await prisma.product.createMany({
      data: products,
      skipDuplicates: true,
    });
    res.status(200).send("Tooted on salvestatud.");
  } catch (err) {
    res.status(500).send({ error: "Toodete salvestamine ebaõnnestus", details: err });
  }
});

// Endpoint: Kasutaja pakkumise salvestamine
app.post("/bids", async (req, res) => {
  try {
    const { productId, username, bidAmount } = req.body;
    await prisma.bid.create({
      data: {
        productId: parseInt(productId),
        username,
        bidAmount,
      },
    });
    res.status(201).send("Pakkumine on salvestatud.");
  } catch (err) {
    res.status(500).send({ error: "Pakkumise salvestamine ebaõnnestus", details: err });
  }
});

// Endpoint: Tagasta kõik aktiivsed oksjonid
app.get("/auctions", async (req, res) => {
    try {
      const now = new Date();
      const auctions = await prisma.product.findMany({
        where: {
          biddingEndDate: {
            gt: now, // Ainult need, mille biddingEndDate on tulevikus
          },
        },
      });
      res.status(200).json(auctions);
    } catch (err) {
      res.status(500).send({ error: "Aktiivsete oksjonite laadimine ebaõnnestus", details: err });
    }
  });

// Endpoint: Tagasta aktiivsed oksjonid kategooriapõhiselt
app.get("/auctions/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const now = new Date();
      const filteredAuctions = await prisma.product.findMany({
        where: {
          biddingEndDate: {
            gt: now,
          },
          productCategory: category, // Filtreeri kategooria järgi
        },
      });
      res.status(200).json(filteredAuctions);
    } catch (err) {
      res.status(500).send({ error: "Kategooriapõhise filtriga oksjonite laadimine ebaõnnestus", details: err });
    }
  });

// Endpoint: Tagasta lõppenud oksjonid ja nende pakkumised
app.get("/completed-auctions", async (req, res) => {
    try {
      const now = new Date();
      const completedAuctions = await prisma.product.findMany({
        where: {
          biddingEndDate: {
            lt: now, // Ainult need, mille biddingEndDate on minevikus
          },
        },
        include: {
          Bids: true, // Kaasa kõik pakkumised, mis seotud selle tootega
        },
      });
      res.status(200).json(completedAuctions);
    } catch (err) {
      res.status(500).send({ error: "Lõppenud oksjonite laadimine ebaõnnestus", details: err });
    }
  });
  
  
  

// Serveri käivitamine
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server töötab: http://localhost:${PORT}`);
});
