/*
   Created By ArxzyDev
   My Contact wa.me/6289513081052
   Rxzy-MD V1.1.0
*/
// Mau Copas? Boleh, Ingat Wmnya jangan di hapus!!!

const axios = require("axios");
const cheerio = require("cheerio");

function pinterest(querry) {
  return new Promise(async (resolve, reject) => {
    axios
      .get("https://id.pinterest.com/search/pins/?autologin=true&q=" + querry, {
        headers: {
          cookie:
            '_auth=1; _b="AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg="; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0',
        },
      })
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const result = [];
        const hasil = [];
        $("div > a")
          .get()
          .map((b) => {
            const link = $(b).find("img").attr("src");
            result.push(link);
          });
        result.forEach((v) => {
          if (v == undefined) return;
          hasil.push(v.replace(/236/g, "736"));
        });
        hasil.shift();
        resolve(hasil);
      });
  });
}

function quotesAnime() {
  return new Promise((resolve, reject) => {
    const page = Math.floor(Math.random() * 184);
    axios
      .get("https://otakotaku.com/quote/feed/" + page)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const hasil = [];
        $("div.kotodama-list").each(function (l, h) {
          hasil.push({
            link: $(h).find("a").attr("href"),
            gambar: $(h).find("img").attr("data-src"),
            karakter: $(h).find("div.char-name").text().trim(),
            anime: $(h).find("div.anime-title").text().trim(),
            episode: $(h).find("div.meta").text(),
            up_at: $(h).find("small.meta").text(),
            quotes: $(h).find("div.quote").text().trim(),
          });
        });
        resolve(hasil);
      })
      .catch(reject);
  });
}

function styletext(teks) {
  return new Promise((resolve, reject) => {
    axios.get("http://qaz.wtf/u/convert.cgi?text=" + teks).then(({ data }) => {
      let $ = cheerio.load(data);
      let hasil = [];
      $("table > tbody > tr").each(function (a, b) {
        hasil.push({
          name: $(b).find("td:nth-child(1) > span").text(),
          result: $(b).find("td:nth-child(2)").text().trim(),
        });
      });
      resolve(hasil);
    });
  });
}

function hentai() {
  return new Promise((resolve, reject) => {
    const page = Math.floor(Math.random() * 1153);
    axios.get("https://sfmcompile.club/page/" + page).then((data) => {
      const $ = cheerio.load(data.data);
      const hasil = [];
      $("#primary > div > div > ul > li > article").each(function (a, b) {
        hasil.push({
          title: $(b).find("header > h2").text(),
          link: $(b).find("header > h2 > a").attr("href"),
          category: $(b)
            .find("header > div.entry-before-title > span > span")
            .text()
            .replace("in ", ""),
          share_count: $(b)
            .find("header > div.entry-after-title > p > span.entry-shares")
            .text(),
          views_count: $(b)
            .find("header > div.entry-after-title > p > span.entry-views")
            .text(),
          type: $(b).find("source").attr("type") || "image/jpeg",
          video_1:
            $(b).find("source").attr("src") ||
            $(b).find("img").attr("data-src"),
          video_2: $(b).find("video > a").attr("href") || "",
        });
      });
      resolve(hasil);
    });
  });
}

function xnxxsearch(query) {
  return new Promise((resolve, reject) => {
    const baseurl = "https://www.xnxx.com";
    fetch(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`, {
      method: "get",
    })
      .then((res) => res.text())
      .then((res) => {
        let $ = cheerio.load(res, {
          xmlMode: false,
        });
        let title = [];
        let url = [];
        let desc = [];
        let results = [];

        $("div.mozaique").each(function (a, b) {
          $(b)
            .find("div.thumb")
            .each(function (c, d) {
              url.push(
                baseurl +
                  $(d).find("a").attr("href").replace("/THUMBNUM/", "/"),
              );
            });
        });
        $("div.mozaique").each(function (a, b) {
          $(b)
            .find("div.thumb-under")
            .each(function (c, d) {
              desc.push($(d).find("p.metadata").text());
              $(d)
                .find("a")
                .each(function (e, f) {
                  title.push($(f).attr("title"));
                });
            });
        });
        for (let i = 0; i < title.length; i++) {
          results.push({
            title: title[i],
            info: desc[i],
            link: url[i],
          });
        }
        resolve({
          code: 200,
          status: true,
          result: results,
        });
      })
      .catch((err) => reject({ code: 503, status: false, result: err }));
  });
}

function xnxxdl(URL) {
  return new Promise((resolve, reject) => {
    fetch(`${URL}`, { method: "get" })
      .then((res) => res.text())
      .then((res) => {
        let $ = cheerio.load(res, {
          xmlMode: false,
        });
        const title = $('meta[property="og:title"]').attr("content");
        const duration = $('meta[property="og:duration"]').attr("content");
        const image = $('meta[property="og:image"]').attr("content");
        const videoType = $('meta[property="og:video:type"]').attr("content");
        const videoWidth = $('meta[property="og:video:width"]').attr("content");
        const videoHeight = $('meta[property="og:video:height"]').attr(
          "content",
        );
        const info = $("span.metadata").text();
        const videoScript = $("#video-player-bg > script:nth-child(6)").html();
        const files = {
          low: (videoScript.match("html5player.setVideoUrlLow\\('(.*?)'\\);") ||
            [])[1],
          high: videoScript.match(
            "html5player.setVideoUrlHigh\\('(.*?)'\\);" || [],
          )[1],
          HLS: videoScript.match(
            "html5player.setVideoHLS\\('(.*?)'\\);" || [],
          )[1],
          thumb: videoScript.match(
            "html5player.setThumbUrl\\('(.*?)'\\);" || [],
          )[1],
          thumb69: videoScript.match(
            "html5player.setThumbUrl169\\('(.*?)'\\);" || [],
          )[1],
          thumbSlide: videoScript.match(
            "html5player.setThumbSlide\\('(.*?)'\\);" || [],
          )[1],
          thumbSlideBig: videoScript.match(
            "html5player.setThumbSlideBig\\('(.*?)'\\);" || [],
          )[1],
        };
        resolve({
          status: 200,
          result: {
            title,
            URL,
            duration,
            image,
            videoType,
            videoWidth,
            videoHeight,
            info,
            files,
          },
        });
      })
      .catch((err) => reject({ code: 503, status: false, result: err }));
  });
}

async function soundcloud(url) {
  return new Promise((resolve, reject) => {
    axios({
      url: "https://aiovideodl.ml/",
      method: "GET",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        cookie:
          "PHPSESSID=3893d5f173e91261118a1d8b2dc985c3; _ga=GA1.2.792478743.1635388171;",
      },
    }).then((data) => {
      let a = cheerio.load(data.data);
      let token = a("#token").attr("value");
      const options = {
        method: "POST",
        url: `https://aiovideodl.ml/wp-json/aio-dl/video-data/`,
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          cookie:
            "PHPSESSID=3893d5f173e91261118a1d8b2dc985c3; _ga=GA1.2.792478743.1635388171;",
        },
        formData: { url: url, token: token },
      };
      request(options, async function (error, response, body) {
        if (error) throw new Error(error);
        res = JSON.parse(body);
        res.status = 200;
        res.author = author;
        resolve(res);
      });
    });
  });
}

function jadwalsholat(query) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://umrotix.com/jadwal-sholat/${query}`)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        $(
          "body > div > div.main-wrapper.scrollspy-action > div:nth-child(3) ",
        ).each(function (a, b) {
          result = {
            status: 200,
            author: "© Naisa-MD",
            tanggal: $(b).find("> div:nth-child(2)").text(),
            imsyak: $(b)
              .find(
                "> div.panel.daily > div > div > div > div > div:nth-child(1) > p:nth-child(2)",
              )
              .text(),
            subuh: $(b)
              .find(
                "> div.panel.daily > div > div > div > div > div:nth-child(2) > p:nth-child(2)",
              )
              .text(),
            dzuhur: $(b)
              .find(
                "> div.panel.daily > div > div > div > div > div:nth-child(3) > p:nth-child(2)",
              )
              .text(),
            ashar: $(b)
              .find(
                "> div.panel.daily > div > div > div > div > div:nth-child(4) > p:nth-child(2)",
              )
              .text(),
            maghrib: $(b)
              .find(
                "> div.panel.daily > div > div > div > div > div:nth-child(5) > p:nth-child(2)",
              )
              .text(),
            isya: $(b)
              .find(
                "> div.panel.daily > div > div > div > div > div:nth-child(6) > p:nth-child(2)",
              )
              .text(),
          };
          resolve(result);
        });
      })
      .catch(reject);
  });
}

async function cerpen(category) {
  return new Promise(async (resolve, reject) => {
    let title = category.toLowerCase().replace(/[()*]/g, "");
    let judul = title.replace(/\s/g, "-");
    let page = Math.floor(Math.random() * 5);
    axios
      .get("http://cerpenmu.com/category/cerpen-" + judul + "/page/" + page)
      .then((get) => {
        let $ = cheerio.load(get.data);
        let link = [];
        $("article.post").each(function (a, b) {
          link.push($(b).find("a").attr("href"));
        });
        let random = link[Math.floor(Math.random() * link.length)];
        axios.get(random).then((res) => {
          let $$ = cheerio.load(res.data);
          let hasil = {
            title: $$("#content > article > h1").text(),
            author: $$("#content > article")
              .text()
              .split("Cerpen Karangan: ")[1]
              .split("Kategori: ")[0],
            kategori: $$("#content > article")
              .text()
              .split("Kategori: ")[1]
              .split("\n")[0],
            lolos: $$("#content > article")
              .text()
              .split("Lolos moderasi pada: ")[1]
              .split("\n")[0],
            cerita: $$("#content > article > p").text(),
          };
          resolve(hasil);
        });
      });
  });
}

async function checkBandwidth() {
  let ind = 0;
  let out = 0;
  for (let i of await require("node-os-utils").netstat.stats()) {
    ind += parseInt(i.inputBytes);
    out += parseInt(i.outputBytes);
  }
  return {
    download: ind,
    upload: out,
  };
}

module.exports = {
  pinterest,
  quotesAnime,
  styletext,
  hentai,
  xnxxsearch,
  xnxxdl,
  soundcloud,
  jadwalsholat,
  cerpen,
  checkBandwidth,
};
