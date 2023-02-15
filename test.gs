function myFunction() {
  var answers = {
    e1:"element1",
    e2:"element2"
  };
   for(itemiName in answers){
    console.log(`%${itemiName}%`,answers[itemiName]);

    }
  throw new Error("これはエラーです");  
}
