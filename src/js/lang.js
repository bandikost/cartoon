var languative;
(function (languative) {
    var phraseIdAttr = "data-phrase-id";

    languative.ignoreTags = {
        img: "<img />",
        br: "<br />",
        hr: "<hr />"
    };

    languative.dictonaries = {
        html: {
            _id: "html",
            _name: "HTML"
        },
        ru: {
            _id: "ru",
            _name: "Русский - Russian"
        },
        en: {
            _id: "en",
            _name: "Deutsche - German"
        }
    };

    languative.selectedDictionary = null;

    function getDictionary(langKey) {
        langKey = langKey.toLowerCase();
        if (langKey in languative.dictonaries)
            return languative.dictonaries[langKey];

        // Dictionary at key "pl-PL" not found, so keep looking for key "pl"
        var sep = langKey.indexOf("-");
        if (sep > 0)
            langKey = langKey.substring(0, sep);
        return languative.dictonaries[langKey];
    }
    languative.getDictionary = getDictionary;

    function getPhrase(phraseId) {
        var res = findPhrase(phraseId);
        if (res)
            return res; else
            return phraseId;
    }
    languative.getPhrase = getPhrase;

    function findPhrase(phraseId) {
        if ((phraseId == null) || (phraseId == ""))
            return null;

        if ((languative.selectedDictionary != null) && (phraseId in languative.selectedDictionary))
            return languative.selectedDictionary[phraseId];
        if (phraseId in languative.dictonaries.html)
            return languative.dictonaries.html[phraseId];

        return null;
    }
    languative.findPhrase = findPhrase;

    function getYesNo(value) {
        if (value === undefined)
            return getPhrase("undefined"); else if (value)
            return getPhrase("yes"); else
            return getPhrase("no");
    }
    languative.getYesNo = getYesNo;

    //IE8 Tweak
    function getAttr(node, attr) {
        var result = (node.getAttribute && node.getAttribute(attr)) || null;
        if (!result && node.attributes) {
            for (var i = 0; i < node.attributes.length; i++) {
                var attrNode = node.attributes[i];
                if (attrNode.nodeName === attr)
                    return attrNode.nodeValue;
            }
        }
        return result;
    }

    function getDictionaryFromHtml() {
        function getNodeValue(node) {
            var res = null;
            if ("innerHTML" in node) {
                res = node["innerHTML"];
            } else {
                res = node.nodeValue;
            }
            if (res != null) {
                res = res.replace(/\s{2,}/g, ' ');
                res = res.replace(/^\s+|\s+$/g, '');
            }
            return res;
        }

        function getTagPhrase(tag) {
            if (tag.childNodes.length > 1) {
                var resPhrase = new Array();
                for (var ci = 0; ci < tag.childNodes.length; ci++) {
                    var chNode = tag.childNodes[ci];
                    var chName = chNode.nodeName.toLowerCase();
                    var chValue = null;

                    if (chName in languative.ignoreTags)
                        chValue = languative.ignoreTags[chName]; else
                        chValue = getNodeValue(chNode);

                    resPhrase.push(chValue);
                }
                return resPhrase;
            } else {
                return getNodeValue(tag);
            }
        }

        var tags = getHtmlTags();

        var resDict = new Object();
        for (var ti = 0; ti < tags.length; ti++) {
            var tag = tags[ti];
            var phraseId = getAttr(tag, phraseIdAttr);
            if ((phraseId != null)) {
                var phraseValue = getTagPhrase(tag);
                if ((phraseId in resDict) && (resDict[phraseId] != phraseValue)) {
                    console.warn("Different phrases with the same data-phrase-id='" + phraseId + "'\n" + " 1: " + JSON.stringify(resDict[phraseId], null, "  ") + "\n 2: " + JSON.stringify(phraseValue, null, "  "));
                } else {
                    resDict[phraseId] = phraseValue;
                }
            }
        }
        return resDict;
    }
    languative.getDictionaryFromHtml = getDictionaryFromHtml;

    function changeLanguage(langKey) {
      localStorage.setItem('lang', langKey);
        function setTagPhrase(tag, phrase) {
            if (tag.childNodes.length > 1) {
                for (var ci = 0; ci < tag.childNodes.length; ci++) {
                    var chNode = tag.childNodes[ci];
                    var nName = chNode.nodeName.toLowerCase();
                    if (!(nName in languative.ignoreTags)) {
                        if ("innerHTML" in chNode) {
                            chNode["innerHTML"] = " " + phrase[ci] + " ";
                        } else {
                            chNode.nodeValue = " " + phrase[ci] + " ";
                        }
                    }
                }
            } else {
                tag.innerHTML = " " + phrase + " ";
            }
        }

        //return;
        var langDict = languative.getDictionary(langKey);
        if (langDict == null) {
            console.warn("Cannot identify dictionary by key '" + langKey + "'. Default dictionary (" + languative.dictonaries.html._id + ": " + languative.dictonaries.html._name + ") used instead.");
            langDict = languative.dictonaries.html;
        }
        languative.selectedDictionary = langDict;

        var tags = getHtmlTags();
        for (var ti = 0; ti < tags.length; ti++) {
            var tag = tags[ti];
            var phraseId = getAttr(tag, phraseIdAttr);
            if ((phraseId != null)) {
                var phraseValue = languative.getPhrase(phraseId);
                if (phraseValue) {
                    setTagPhrase(tag, phraseValue);
                } else {
                    console.warn("Phrase not definied in dictionary: data-phrase-id='" + phraseId + "'");
                }
            }
        }

        if (langDict["Title"] != null) {
            document.title = langDict["Title"];
        }
    }
    languative.changeLanguage = changeLanguage;

    function getHtmlTags() {
        var res = new Array();
        var docTags = document.body.getElementsByTagName("*");

        for (var i = 0; i < docTags.length; i++) {
            var docTag = docTags[i];
            var phraseId = getAttr(docTag, phraseIdAttr);
            if (phraseId)
                res.push(docTag);
        }
        return res;
    }

    var initialized = false;

    function init() {
        if (!initialized) {
            initialized = true;
            var htmlDict = languative.getDictionaryFromHtml();

            for (var dictKey in htmlDict) {
                if (!(dictKey in languative.dictonaries.html)) {
                    languative.dictonaries.html[dictKey] = htmlDict[dictKey];
                }
            }
            var nav = window.navigator;
            languative.changeLanguage(localStorage.getItem('lang') || nav.userLanguage || nav.language);
        }
    }
    languative.init = init;

    function modifyDictionary(langKey, dictModifications) {
        var langDict = languative.getDictionary(langKey);
        if (langDict == null) {
            languative.dictonaries[langKey.toLowerCase()] = dictModifications;
        } else {
            for (var dictKey in dictModifications) {
                langDict[dictKey] = dictModifications[dictKey];
            }
        }
    }
    languative.modifyDictionary = modifyDictionary;
})(languative || (languative = {}));

if (document.addEventListener)
    document.addEventListener('DOMContentLoaded', languative.init);

if (window.addEventListener) {
    window.addEventListener('load', languative.init, false);
} else {
    window.attachEvent('onload', languative.init);
}


    languative.modifyDictionary("ru", {
                Title: "Главная",
                modalanguage: "Сменить язык",
                lc: "Личный кабинет",
                about: "О сказке",
                video: "Видеокниги",
                planets: "Планеты",
                audiobook: "Аудиокниги",
                Rena: "Ренаняо",
                space: "Космословарь",
                product: "Товары",
                contact: "Контакты",
                general: "Главная",
                aboutplanetsfromstory: "О планетах из сказки",
                mercury: "- Меркурий",
                venus: "- Венера",
                pluto: "- Плутон",
                neptune: "- Нептун",
                jupiter: "- Юпитер",
                saturn: "- Сатурн",
                mars: "- Марс",
                uran: "- Уран",
                subscribe: "Подписаться",
                
            });
            languative.modifyDictionary("en", {
                Title: "General",
                modalanguage: "Change Language",
                lc: "Your account",
                about: "About story",
                video: "Videobook",
                planets: "Planets",
                audiobook: "Audiobook",
                Rena: "Renanyo",
                space: "SpaceWords",
                product: "Product",
                contact: "Contacts",
                general: "Main",
                aboutplanetsfromstory: "About planets from story",
                mercury: "- Mercury",
                venus: "- Venus",
                pluto: "- Pluto",
                neptune: "- Neptune",
                jupiter: "- Jupiter",
                saturn: "- Saturn",
                mars: "- Mars",
                uran: "- Uran",
                subscribe: "Subscribe",
            });











            let select = function () {
                let selectHeader = document.querySelectorAll('.select__header');
                let selectItem = document.querySelectorAll('.select__item');
            
                selectHeader.forEach(item => {
                    item.addEventListener('click', selectToggle)
                });
            
                selectItem.forEach(item => {
                    item.addEventListener('click', selectChoose)
                });
            
                function selectToggle() {
                    this.parentElement.classList.toggle('is-active');
                }
            
                function selectChoose() {
                    let text = this.innerText,
                        select = this.closest('.select'),
                        currentText = select.querySelector('.select__current');
                    currentText.innerText = text;
                    select.classList.remove('is-active');
            
                }
            
            };
            
            
            select();