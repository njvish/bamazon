var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"",
    database:"bamazon"
})

connection.connect(function(err){
    if (err) throw err;
    console.log("connection successful!");
    makeTable();
})

var makeTable = function(){
    connection.query("SELECT * FROM products", function(err,res){
        for(var i=0; i<res.length; i++){
            console.log(res[i].itemid+" || "+res[i].productname+" || "+
                res[i].departmentname+" || "+res[i].price+" || "+res[i].
                stockquantity+"\n");
        }

    promptCustomer(res);
    })
}

var promptCustomer = function(res) {
    inquirer.prompt([{
        type:'input',
        name:'choice',
        message:"See anything you like? [To cancel press C]",
    }]).then(function(answer){
        var correct = false;
        if(answer.choice.toUpperCase()=="C"){
            process.exit();
        }
     for(var i=0;i<res.length;i++){
        if(res[i].productname==answer.choice){
        correct=true;
        var product=answer.choice;
        var id=i;
        inquirer.prompt({
            type:"input",
            name:"quantity",
            message:"How many would you like?",
            validate: function(value){
                if(isNaN(value)==false){
                  return true;
                } else {
                  return false;
                }
            }
            }).then(function(answer){
               if((res[id].stockquantity-answer.quantity)>0){
                    connection.query("UPDATE products SET stockquantity='"+(res[id].stockquantity-answer.quantity)
                    +"' WHERE productname='"+product+"'", function(err,res2){
                    console.log("------------------------");
                    console.log("Item has been purchased!");
                    console.log("------------------------");
                    makeTable();
               })
            } else {
                console.log("-------------------");
                console.log("Item not available.");
                console.log("-------------------");
                promptCustomer(res);
            }
        })
    }
}
        if(i==res.length && correct==false){
            console.log("-----------------------------");
            console.log("Sorry we are out of those! :(");
            console.log("-----------------------------")
            promptCustomer(res);
        }
    })
}

