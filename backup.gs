function generateContact(e) {


// 送信時の日付を取得
  var today = new Date();
  today = Utilities.formatDate(today,"JST","YYYY/MM/dd").replace('/','年').replace('/','月') +"日";
  console.log(today); 


//フォームから回答を取得
  var itemResponses = e.response.getItemResponses();

  var hireDate = itemResponses[0].getResponse().replace('-','年').replace('-','月') +"日";
  var name = itemResponses[1].getResponse();
  var category = itemResponses[2].getResponse();
  var startDate = itemResponses[3].getResponse().replace('-','年').replace('-','月') +"日";
  var finalDate = itemResponses[4].getResponse().replace('-','年').replace('-','月') +"日";
  var department = itemResponses[5].getResponse();
  var content = itemResponses[6].getResponse();
  var place = itemResponses[7].getResponse();
  var timePerDay = itemResponses[8].getResponse();
  var timePerWeek = itemResponses[9].getResponse();
  var dayPerWeek = itemResponses[10].getResponse();
  var salary = itemResponses[11].getResponse();

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

  body.replaceText("%today%", today);
  body.replaceText("%hireDate%", hireDate);
  body.replaceText("%name%", name);
  body.replaceText("%category%", category);
  body.replaceText("%startDate%", startDate);
  body.replaceText("%finalDate%", finalDate);
  body.replaceText("%department%", department);
  body.replaceText("%content%", content);
  body.replaceText("%place%", place);
  body.replaceText("%timePerDay%", timePerDay);
  body.replaceText("%timePerWeek%", timePerWeek);
  body.replaceText("%dayPerWeek%", dayPerWeek);
  body.replaceText("%salary%", salary);

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
  //フォルダーIDは引数のdes_drive_idを使用します
  let folder = DriveApp.getFolderById(des_drive_id);

  //PDFを指定したフォルダに保存する
  folder.createFile(blob);


  // 複製したファイルを削除
  var fileData = DriveApp.getFileById(des_doc_id);
  //IDから取得したファイルをゴミ箱のフラグをtrueにする
  fileData.setTrashed(true);

  console.log("複製したファイルを削除");


}
