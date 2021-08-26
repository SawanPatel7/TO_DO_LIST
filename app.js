const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://sawan:test123@cluster0.aww2b.mongodb.net/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = {
    itemName: String
};

const Item = mongoose.model("Item", itemSchema);

const Item1 = new Item({
    itemName: "Welcome to todolist"
});

const Item2 = new Item({
    itemName: "Hit the + button to add into list ."
});

const Item3 = new Item({
    itemName: "<--- Hit this to delete."
});


app.get("/", function (req, res) {
    var today = new Date();

    var options = {
        day: "numeric",
        month: "long",
        weekday: "long"

    };
    var day = today.toLocaleDateString("en-US", options);

    Item.find({}, function (err, itemFound) {
        if (itemFound.length === 0) {
            Item.insertMany([Item1, Item2, Item3], function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Successfully saved to DB");
                }
            });
            res.redirect("/");

        } else {
            res.render("list", { today_day: day, itemslist: itemFound });
        }
    });

});

app.post("/delete", function (req, res) {
    const deleteItem = req.body.check;
    // console.log(deleteItem);
    Item.deleteOne({ _id: deleteItem }, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully deleted");
        }
    })
    res.redirect("/");
});

app.post("/", function (req, res) {
    const item = req.body.nameit;
    const addItem = new Item({
        itemName: item
    });
    addItem.save();
    res.redirect("/");

});

app.listen(3000, function () {
    console.log("server started at port 3000");
});