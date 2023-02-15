function generateContact(e) {

// 送信時の日付を取得
  let today = new Date();
  today = Utilities.formatDate(today,"JST","YYYY/MM/dd").replace('/','年').replace('/','月') +"日";
  console.log(today); 


//フォームから回答を取得
  let itemResponses = e.response.getItemResponses();

  let answers= {
    hireDate: itemResponses[0].getResponse().replace('-','年').replace('-','月') +"日",
    name: itemResponses[1].getResponse(),
    category: itemResponses[2].getResponse(),
    startDate:  itemResponses[3].getResponse().replace('-','年').replace('-','月') +"日",
    finalDate:  itemResponses[4].getResponse().replace('-','年').replace('-','月') +"日",
    department: itemResponses[5].getResponse(),
    content:  itemResponses[6].getResponse(),
    place:  itemResponses[7].getResponse(),
    timePerDay: itemResponses[8].getResponse(),
    timePerWeek:  itemResponses[9].getResponse(),
    dayPerWeek: itemResponses[10].getResponse(),
    salary: itemResponses[11].getResponse()
    };

    answers.today = today;

  console.log("フォーム情報を取得");


//テンプレートの複製
  let src_doc_id= "1N86QkxENyJrlzqph6bIjx3uNkIHTyvZGpLiMMCAeAXE";//テンプレートのid
  let des_drive_id = "1xp2E2OCwBg7J4FXUNjnlpbsUdpSO1oio";//pdf保存先のid

  let src_doc = DriveApp.getFileById(src_doc_id);
  let des_drive = DriveApp.getFolderById(des_drive_id);
  let fileName = `雇用契約書_${name}_${today}`;
  let duplicateDocument   = src_doc.makeCopy(fileName, des_drive);
  let duplicateDocumentId = duplicateDocument.getId();
  let des_doc = DocumentApp.openById(duplicateDocumentId);
  let des_doc_id = des_doc.getId();


  console.log("テンプレートを複製");


// ドキュメントの置換
  let body = des_doc.getBody();

  for(itemName in answers){
    body.replaceText(`%${itemName}%`,answers[itemName]);
  }

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
  let fileData = DriveApp.getFileById(des_doc_id);
  //IDから取得したファイルをゴミ箱のフラグをtrueにする
  fileData.setTrashed(true);

  console.log("複製したファイルを削除");


}