/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
 const AWS = require("aws-sdk");
 const dynamodb = new AWS.DynamoDB.DocumentClient();
 
 //createTodo function started 
 async function createTodo(event, scenario) 
 {
     const methodName = "createTodo";
     try {
       console.log("Received event:", JSON.stringify(event, null, 2));
   
       const { name, description } = event.arguments.input;
       if (!name || !description) {
         throw new Error("Missing required fields: name or description");
       }
   
       const timestamp = Date.now().toString();
       const item = {
         id: timestamp,
         name,
         description,
       };
   
       const params = {
         TableName: "ToDotable",
         Item: item,
       };
   
       await dynamodb.put(params).promise();
   
       console.log("Successfully created item:", JSON.stringify(item, null, 2));
   
       return item;
     } catch (err) {
       console.error("Error:", err);
       console.error("Stack trace:", err.stack);
   
       throw new Error("Failed to create item>>>", err);
     }
   }
  //createTodo function ended

  //updateTodo function started 
  async function updateTodo(event, scenario) 
  {
    try {
      console.log("Received event:", JSON.stringify(event, null, 2));
  
      const { id, name, description } = event.arguments.input;
      if (!id || (!name && !description)) {
        throw new Error("Missing required fields: id or name or description");
      }
  
      const updatedFields = {};
      if (name) updatedFields.name = name;
      if (description) updatedFields.description = description;
  
      const params = {
        TableName: "ToDotable",
        Key: { id },
        UpdateExpression: "set #name = :n, #description = :d",
        ExpressionAttributeNames: {
          "#name": "name",
          "#description": "description",
        },
        ExpressionAttributeValues: {
          ":n": updatedFields.name,
          ":d": updatedFields.description,
        },
        ReturnValues: "ALL_NEW",
      };
  
      const result = await dynamodb.update(params).promise();
  
      console.log("Successfully updated item:", JSON.stringify(result, null, 2));
  
      return result.Attributes;
    } catch (err) {
      console.error("Error:", err);
      console.error("Stack trace:", err.stack);
  
      throw new Error("Failed to update item>>>", err);
    }
  }
  //updateTodo function ended 

  //deleteTodo function started 
  async function deleteTodo(event, scenario) 
  {
      try {
      console.log("Received event:", JSON.stringify(event, null, 2));
  
      const id = event.arguments.input.id;
      console.log("Arguments>>>", event);
      if (!id) {
          throw new Error("Missing required field: id");
      }
  
      const params = {
          TableName: "ToDotable",
          Key: { id },
      };
  
      await dynamodb.delete(params).promise();
  
      console.log("Successfully deleted item with id:", id);
  
      return true;
      } catch (err) {
      console.error("Error:", err);
      console.error("Stack trace:", err.stack);
  
      throw new Error("Failed to delete item>>>", err);
      }
  }
  //deleteTodo function ended 

    //findAllTodos function started
    async function findAllTodos(event, scenario) {
        try {
          console.log("Received event:", JSON.stringify(event, null, 2));
      
          const params = {
            TableName: "ToDotable",
          };
      
          const result = await dynamodb.scan(params).promise();
      
          console.log(
            "Successfully retrieved items:",
            JSON.stringify(result.Items, null, 2)
          );
      
          return result.Items;
        } catch (err) {
          console.error("Error:", err);
          console.error("Stack trace:", err.stack);
      
          throw new Error("Failed to retrieve items>>>", err);
        }
      }
    //findAllTodos function ended

     //getTodo function started
     async function getTodo(event, scenario) {
        try {
          console.log("Received event:", JSON.stringify(event, null, 2));

          const id = event.arguments.input.id;
          console.log("Arguments>>>", event);

          if (!id) {
            throw new Error("Missing required field: id");
        }

          const params = {
            TableName: "ToDotable",
            Key: { id },
          };
      
          const result = await dynamodb.get(params).promise();
      
          console.log("Successfully get item with id:", id);

          console.log(
            "Successfully retrieved item:",
            JSON.stringify(result.Item, null, 2)
          );
      
          return result.Item;
        } catch (err) {
          console.error("Error:", err);
          console.error("Stack trace:", err.stack);
      
          throw new Error("Failed to retrieve the item>>>", err);
        }
      }
    //getTodo function ended

   const resolvers = {

     Mutation: {
       createTodo: (ctx) => {
         return createTodo(ctx);
       },

       updateTodo: (ctx) => {
         return updateTodo(ctx);
       },

       deleteTodo: (ctx) => {
         return deleteTodo(ctx);
       },
     },

     Query: {
        findAllTodos: (ctx) => {
          return findAllTodos(ctx);
        },
        getTodo: (ctx) => {
            return getTodo(ctx);
          },
      },

   };
 
 
 exports.handler = async (event) => {
     console.log("event>>>>>>>>>>>>>>>>>>>>>>>>>>>>", event);
     const typeHandler = resolvers[event.typeName];
     if (typeHandler) {
     const resolver = typeHandler[event.fieldName];
     if (resolver) {
         return await resolver(event);
     }
     }
     throw new Error("Resolver not found.");
 };
 
 