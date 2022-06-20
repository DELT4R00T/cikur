const kontolodon = require("./package.json")
const express = require("express")
const ytdl = require("ytdl-core")
const yts = require("yt-search")

const PORT = process.env.PORT || 5000;
const app = express();
app.set('view engine', 'ejs')
app.use(express.json())

/*app.get("/", (req, res) => {
	console.log("GET \"/\"")
	res.redirect("/youtube");
});*/

app.get("/", (req, res) => {
    console.log("GET \"/\"")
	return res.render("youtube",{
	    versi: kontolodon.version
	})
});

app.get("/yt-download", async(req, res) => {
    console.log(`GET \"/yt-download?q=${req.query.q}\"`)
    var query = req.query.q;
    var url = /https?:\/\//.test(query);
    try {
        if (url) {
            if (!ytdl.validateURL(query) == true) return res.json({detail: "Invalid URL!"})
            var v_id = query.split('v=')[1] || query.split('.be/')[1]
            info = await ytdl.getInfo(query)
            return res.render("yt-download", {
                versi: kontolodon.version,
                query: query,
                url: "https://www.youtube.com/embed/" + v_id,
                info: info.formats.sort((a, b) => {
                    return a.mimeType < b.mimeType })
            })
        } else {
            if (!query) return res.json({detail: "Invalid query!"})
            var results = await yts(query);
            var vid = results.all.find(video => video.seconds < 3600)
            if (!vid) return res.json({detail: "Video not found!"})
            var v_id = vid.url.split('v=')[1] || vid.url.split('.be/')[1];
            info = await ytdl.getInfo(vid.url)
            return res.render("yt-download", {
                versi: kontolodon.version,
                query: query,
                url: "https://www.youtube.com/embed/" + v_id,
                info: info.formats.sort((a, b) => {
                    return a.mimeType < b.mimeType;
                })
            })
        }
    } catch(e) {
        return res.json({detail: e.message});
    }
})

app.get("/redirect", (req, res) => {
	console.log("GET \"/redirect\"")
	res.redirect("/yt-download?q=" + req.query.q);
});

app.get("/changelog", (req, res) => {
    console.log("GET \"/changelog\"")
	return res.render("changelog",{
	    versi: kontolodon.version
	})
});

app.listen(PORT, () => {
	console.log("Server is running on http://localhost:5000");
});
