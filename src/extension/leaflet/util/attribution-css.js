if (typeof L === 'object') {
  var controlCss = document.createElement("style");
  controlCss.type = "text/css";
  controlCss.innerHTML = ".leaflet-container .leaflet-condensed-attribution {" +
      "margin: 10px;" +
      "padding: 0;" +
      "border-radius: 26px;" +
      "border: 6px solid rgba(0,0,0,.2);" +
      "background: rgba(255,255,255,.8);" +
      "display: -webkit-box;" +
      "display: -ms-flexbox;" +
      "display: flex;" +
  "}" +
  ".leaflet-condensed-attribution .attributes-body {" +
    "display: none;" +
    "padding: 0 4px 0 12px;" +
    "height: 36px;" +
    "line-height: 36px;" +
  "}" +
  ".leaflet-condensed-attribution:hover .attributes-body {" +
    "display: inline-block !important;" +
  "}" +
  ".leaflet-condensed-attribution .attributes-emblem {" +
    "height: 36px;" +
    "width: 36px;" +
    "font-size: 14px;" +
    "display: -webkit-box;" +
    "display: -ms-flexbox;" +
    "display: flex;" +
    "-webkit-box-align: center;" +
        "-ms-flex-align: center;" +
            "align-items: center;" +
    "-webkit-box-pack: center;" +
      "-ms-flex-pack: center;" +
            "justify-content: center;" +
  "}" +
  ".emblem-wrap, .emblem-wrap img {" +
      "height: 20px;" +
      "width: 20px;" +
  "}";

  document.getElementsByTagName("head")[0].appendChild(controlCss);
}
