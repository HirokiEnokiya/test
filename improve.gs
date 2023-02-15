function generateContact(e) {


// 送信時の日付を取得
  var today = new Date();
  today = Utilities.formatDate(today,"JST","YYYY/MM/dd").replace('/','年').replace('/','月') +"日";
  console.log(today); 


//フォームから回答を取得
  var itemResponses = e.response.getItemResponses();

  var itemNames= ["hireDate","name","category","startDate","finalDate","department","content","place","timePerDay","timePerWeek","dayPerWeek","salary"];
  var answers = [];
  
  for(i=0;i<itemNames.length;i++) {
    answers[i] = itemResponses[i].getResponse();
  }

  answers[0].replace('-','年').replace('-','月') +"日";
  answers[3].replace('-','年').replace('-','月') +"日";
  answers[4].replace('-','年').replace('-','月') +"日";


  console.log("フォーム情報を取得");


//テンプレートの複製
  var src_doc_id= "1N86QkxENyJrlzqph6bIjx3uNkIHTyvZGpLiMMCAeAXE";//テンプレートのid
  var des_drive_id = "1xp2E2OCwBg7J4FXUNjnlpbsUdpSO1oio";//pdf保存先のid

  var src_doc = DriveApp.getFileById(src_doc_id);
  var des_drive = DriveApp.getFolderById(des_drive_id);
  var fileName = "雇用契約書_" + name + "_" + today;
  var duplicateDocument   = src_doc.makeCopy(fileName, des_drive);
  var duplicateDocumentId = duplicateDocument.getId();
  var des_doc = DocumentApp.openById(duplicateDocumentId);
  var des_doc_id = des_doc.getId();


  console.log("テンプレートを複製");


// ドキュメントの置換
  var body = des_doc.getBody();

  for(i=0;i<itemNames.length;i++){
    body.replaceText(`%${itemNames[i]}%`,answers[i]);
  }

  body.replaceText("%today%", today);



  des_doc.saveAndClose();

  console.log("契約書を生成");

//pdfを生成
  //PDFを作成するためのベースとなるURL
  let url = "https://docs.google.com/document/d/"
          +  des_doc_id
          + "/export?&exportFormat=pdf&format=pdf";

  //アクセストークンを取得する
  let token = ScriptApp.getOAuthToken();

  //headersにアクセストークンを格納する
  let options = {
    headers: {
        'Authorization': 'Bearer ' +  token
    }
  };
 
  //PDFを作成する
  let blob = UrlFetchApp.fetch(url, options).getBlob().setName(fileName + '.pdf');

  //PDFの保存先フォルダー
  let folder = DriveApp.getFolderById(des_drive_id);

  //PDFを指定したフォルダに保存する
  folder.createFile(blob);


  // 複製したファイルを削除
  var fileData = DriveApp.getFileById(des_doc_id);
  //IDから取得したファイルをゴミ箱のフラグをtrueにする
  fileData.setTrashed(true);

  console.log("複製したファイルを削除");


}