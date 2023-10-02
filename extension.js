const vscode = require('vscode');
const http = require('http'); // Node.jsのHTTPモジュールをインポート

//オプション
const options = {
	hostname: 'funky802.com', // 外部サイトのホスト名を指定
	port: 80, // ポート番号を指定（HTTPの場合は80）
	path: '/site/onairlist', // パスを指定
	method: 'GET', // HTTPメソッドを指定
};


const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
statusBarItem.show()

function fetchDataFromExternalSite() {


	const req = http.request(options, (res) => {
		let data = '';

		res.on('data', (chunk) => {
			data += chunk;
		});

		res.on('end', () => {
			//ここで取得したHTMLから指定箇所を取得
			const songRegex = /<span id="noa_song">(.*?)<\/span>/; // 曲名
			const matchSong = data.match(songRegex); // マッチする部分を検索
			const artistRegex = /<span id="noa_artist">(.*?)<\/span>/; // 歌手名
			const matchArtist = data.match(artistRegex); // マッチする部分を検索

			if (matchSong && matchArtist) {
				const song = matchSong[1]; // 曲名
				const artist = matchArtist[1]; // 歌手名

				statusBarItem.text = '♪Now On Air♪　' + song + ' / ' + artist; // someValueは実際のデータのキーに置き換える
			}

		});
	});

	req.on('error', (error) => {
		console.error('データ取得に失敗:', error);
	});

	req.end();
}

fetchDataFromExternalSite();
setInterval(fetchDataFromExternalSite, 60000)