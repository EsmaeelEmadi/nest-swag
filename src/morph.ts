import { Project, SyntaxKind, ClassDeclaration, PropertyDeclaration, CallExpression, MethodDeclaration, FunctionDeclaration } from "ts-morph";

const httpMethods = ['Get', 'Post', 'Put', 'Delete', 'Patch', 'Options', 'Head'];

// Initialize a new project based on your tsconfig.json
const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
});

// Retrieve all TypeScript source files in the src directory
const sourceFiles = project.getSourceFiles('src/**/*.ts');

// Filter out classes that have the @Controller decorator
const controllers = sourceFiles.flatMap(sourceFile =>
  sourceFile.getClasses().filter(classDeclaration =>
    classDeclaration.getDecorators().some(decorator =>
      decorator.getName() === 'Controller'
    )
  )
);

const services = sourceFiles.flatMap(sourceFile =>
  sourceFile.getClasses().filter(classDeclaration =>
    classDeclaration.getDecorators().some(decorator =>
      decorator.getName().endsWith("Service")
    )
  )
);

function getFunctionOrMethodDeclaration(callExpr: CallExpression): FunctionDeclaration | MethodDeclaration | undefined {
  // Get the expression being called (could be an identifier or property access)
  const expression = callExpr.getExpression();

  // Retrieve the symbol associated with the call expression
  const symbol = expression.getSymbol();
  if (symbol) {
    // Get all declarations associated with that symbol
    const declarations = symbol.getDeclarations();
    for (const declaration of declarations) {
      if (declaration.getKind() === SyntaxKind.FunctionDeclaration ||
        declaration.getKind() === SyntaxKind.MethodDeclaration) {
        return declaration as FunctionDeclaration | MethodDeclaration;
      }
    }
  }
  return undefined;
}



// Iterate through each controller and find methods with HTTP method decorators
controllers.forEach(controller => {
  console.log(`\nController: ${controller.getName()}`);
  const serviceName = controller.getName()?.replace("Controller", "Service");

  console.log("service name", serviceName);

  const methods = controller.getMethods();

  methods.forEach(method => {
    method.getDecorators().forEach(decorator => {
      const decoratorName = decorator.getName();
      console.log("decorator name", decoratorName);

      if (httpMethods.includes(decoratorName)) {
        const methodDeclaration = decorator.getParentIfKind(SyntaxKind.MethodDeclaration);
        console.log("----------", methodDeclaration?.getName());
        if (methodDeclaration) {
          const returnStmts = methodDeclaration.getDescendantsOfKind(SyntaxKind.ReturnStatement);

          returnStmts.forEach(retStmt => {
            const expr = retStmt.getExpression();

            if (expr) {
              if (expr.getKind() === SyntaxKind.CallExpression) {
                const callExpr = expr.asKindOrThrow(SyntaxKind.CallExpression);
                const calledDeclaration = getFunctionOrMethodDeclaration(callExpr);
                console.log("****", calledDeclaration);

                if (calledDeclaration) {
                  console.log(`Called function/method: ${calledDeclaration.getName()}`);
                  console.log(calledDeclaration.getText());
                  const calledDeclarationReturnStmts = calledDeclaration.getDescendantsOfKind(SyntaxKind.ReturnStatement);
                  const calledDeclarationThrowStmts = calledDeclaration.getDescendantsOfKind(SyntaxKind.ThrowStatement);
                  console.log("!!!", calledDeclarationReturnStmts);
                  console.log("@@@", calledDeclarationThrowStmts);
                } else {
                  console.log("Could not resolve the called function/method.");
                }

              }
            }



            //console.log(expr?.getSymbol(), retStmt.getSymbol());
            //console.log("===========");
            //console.log(expr?.getFullText(), expr?.getText());
            //console.log(expr?.getSourceFile().getFilePath());


            //  //  //const childIdentifiers = retStmt.getChildrenOfKind(SyntaxKind.Identifier);
            //  //  //const descendantIdentifiers = node.getDescendantsOfKind(SyntaxKind.Identifier);
            //  //
            //  //  //  const dtoClass = project.getSourceFiles("src/**/*.ts")
            //  //  //    .flatMap(file => file.getClasses())
            //  //  //    .find(cls => cls.getName() === dtoName);
            //  //
            //  //  //if (expr && expr.getKind() === SyntaxKind.NewExpression) {
            //  //  //  const newExpr = expr;
            //  //  //  // Try to retrieve the class name from the NewExpression.
            //  //  //  const identifier = newExpr.getFirstChildByKind(SyntaxKind.Identifier);
            //  //  //  if (identifier) {
            //  //  //    console.log(identifier.getText())
            //  //  //    //dtoClassNames.add(identifier.getText());
            //  //  //  }
            //  //  //}
          });
        }

        //const throwStmts = getHelloMethod.getDescendantsOfKind(SyntaxKind.ThrowStatement);

        //  // Optionally, extract any arguments provided to the decorator (e.g., the route path)
        //  //const decoratorArgs = decorator.getArguments().map(arg => arg.getText());
        //  //
        //  //console.log(`  Found ${decoratorName} on method "${method.getName()}"` +
        //  //  (decoratorArgs.length ? ` with arguments: ${decoratorArgs.join(', ')}` : ''));
      }
    });
  });
});



// Helper: Generate a simple JSON schema from a DTO class.
function generateJsonSchema(dto: ClassDeclaration) {
  const schema: any = {
    type: "object",
    properties: {},
    required: []
  };

  dto.getProperties().forEach((prop: PropertyDeclaration) => {
    const propName = prop.getName();
    const typeText = prop.getType().getText();

    // Map TypeScript types to JSON schema types.
    let jsonType: string;
    if (typeText.includes("string")) {
      jsonType = "string";
    } else if (typeText.includes("number")) {
      jsonType = "number";
    } else if (typeText.includes("boolean")) {
      jsonType = "boolean";
    } else if (typeText.includes("[]") || typeText.includes("Array")) {
      jsonType = "array";
    } else {
      jsonType = "object"; // Fallback for more complex types.
    }

    schema.properties[propName] = { type: jsonType };

    // Consider a property required if it doesn't have an optional modifier.
    if (!prop.hasQuestionToken()) {
      schema.required.push(propName);
    }
  });

  return schema;
}

// 1. Locate the AppService class and its getHello method.
const serviceFile = project.getSourceFiles("src/**/*.ts");
const appService = serviceFile
  .flatMap(file => file.getClasses())
  .find(cls => cls.getName() === "AppService");

if (!appService) {
  throw new Error("AppService not found");
}

//const getHelloMethod = appService.getMethod("getHello");
//if (!getHelloMethod) {
//  throw new Error("getHello method not found in AppService");
//}

//// 2. Analyze the getHello method to extract DTO classes from its return statements.
//const returnStmts = getHelloMethod.getDescendantsOfKind(SyntaxKind.ReturnStatement);
//const throwStmts = getHelloMethod.getDescendantsOfKind(SyntaxKind.ThrowStatement);
//const dtoClassNames = new Set<string>();
//
//returnStmts.forEach(retStmt => {
//  const expr = retStmt.getExpression();
//  if (expr && expr.getKind() === SyntaxKind.NewExpression) {
//    const newExpr = expr;
//    // Try to retrieve the class name from the NewExpression.
//    const identifier = newExpr.getFirstChildByKind(SyntaxKind.Identifier);
//    if (identifier) {
//      dtoClassNames.add(identifier.getText());
//    }
//  }
//});
//
//console.log("Found DTO classes:", Array.from(dtoClassNames));
//
//// 3. For each DTO class name, find the corresponding class declaration and generate a JSON schema.
//const swaggerComponents: Record<string, any> = {};
//
//dtoClassNames.forEach(dtoName => {
//  const dtoClass = project.getSourceFiles("src/**/*.ts")
//    .flatMap(file => file.getClasses())
//    .find(cls => cls.getName() === dtoName);
//
//  if (dtoClass) {
//    const schema = generateJsonSchema(dtoClass);
//    swaggerComponents[dtoName] = schema;
//  }
//});
//
//// 4. Create a Swagger (OpenAPI) document that uses these DTO schemas.
//// Here, we assume your endpoint (e.g., GET "/") can return any of these DTOs.
//const swaggerDoc = {
//  openapi: "3.0.0",
//  info: {
//    title: "Auto-generated Swagger",
//    version: "1.0.0"
//  },
//  paths: {
//    "/": {
//      get: {
//        summary: "getHello endpoint",
//        responses: {
//          "200": {
//            description: "Response that could be one of multiple DTOs",
//            content: {
//              "application/json": {
//                schema: {
//                  oneOf: Object.keys(swaggerComponents).map(dtoName => ({
//                    $ref: `#/components/schemas/${dtoName}`
//                  }))
//                }
//              }
//            }
//          }
//        }
//      }
//    }
//  },
//  components: {
//    schemas: swaggerComponents
//  }
//};
//
//// 5. Inject the generated swaggerDoc into your SwaggerModule (or write to a file, etc.)
//console.log(JSON.stringify(swaggerDoc, null, 2));
