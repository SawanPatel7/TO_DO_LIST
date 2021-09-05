require ("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect( process.env.DB , { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = {
    itemName: String
};

const Item = mongoose.model("Item", itemSchema);

const Item1 = new Item({
    itemName: "Welcome to To_do_list"
});

const Item2 = new Item({
    itemName: "Hit the + button to add into list ."
});

const Item3 = new Item({
    itemName: "Hit clickbox to delete."
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
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
    console.log("server started at port 3000");
});