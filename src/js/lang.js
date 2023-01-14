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
            _name: "Английский - English"
        },
        es: {
            _id: "es",
            _name: "Испанский - Spanish"
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
                mercury: "Меркурий",
                venus: "Венера",
                pluto: "Плутон",
                neptune: "Нептун",
                jupiter: "Юпитер",
                saturn: "Сатурн",
                mars: "Марс",
                uran: "Уран",
                subscribe: "Подписаться",
                paymethod : "Оплатите подписку, чтобы видеть дальнешие серии",
                upload : "Загрузить еще",
                language: "Язык",
                menu : "Меню",
                UranText : "Холодная планета, покрытая льдом. Температура на поверхности -224 градуса, а ветры иногда дуют со скоростью 250 метров в секунду. Вас точно сдует с этой планеты.",
                MarsText : "Марс также называется красной планетой. Там очень часто случаются пыльевые бури. По мнению учёных, Марс мог быть когда-то обитаемым. Существует много идей и проектов по терраформации Марса, то есть превращение его в землеподобную и пригодную для проживания планету. Кто знает, может однажды мы будем там жить?",
                SaturnText : "Ещё один газовый гигант. У него тоже есть свой пояс астероидов. Выглядит как халахуп. У Сатурна аж 83 спутника! Самый примечательный из них это Титан. Там есть вода в жидком виде, правда состоит она из метана, который ни в коем случае нельзя пить.",
                JupiterText : "Самая большая планета нашей солнечной системы. Также именуется газовым гигантом. Планета имеет огромный пояс астероидов. У Юпитера 80 естественных спутников (лун), некоторые из которых очень красивые, например Каллисто и Ио.",
                NeptuneText : "Ещё один ледяной гигант. А на нём скорость ветра 600 метров в секунду. Нептун в четыре раза больше Земли и он весь голубого цвета.",
                PlutoText : "Самая дальняя и самая маленькая планета в нашей солнечной системе. Состоит из металла и льда. Там холодно. Очень холодно. Плутон находится на границе нашей солнечной системы, а за ним — необъятный космос.",
                VenusText : "Самая горячая планета в нашей солнечной системе. Она также и самая яркая. Венера названа так в честь богини женственности и любви.",
                MercuryText : "Самая ближайшая к Солнцу планета. Год там длится всего 88 дней. И день может длится столько же. Там очень много кратеров. Также, на Меркурии нет разных сезонов года. Там всё время осень.",
                


                Astronomy : "Астрономия ",
                AstronomyText : "Наука о Вселенной, которая изучает расположение, структуру и происхождение небесных тел и систем",
                Universe : "Вселенная",
                UniverseText : "Всё пространство на небе, которое видно и не видно глазу. Вселенная многогранна и бесконечно.",
                Galaxy : " Галактика",
                GalaxyText : "Система из звёзд, звёздного газа и пыли, и планет.",
                Exoplanet : " Экзопланета ",
                ExoplanetText : "Планета, нахоящаяся за пределами Солнечной системы, в системе другой звезды. А сегодняшний день известны около 5000 экзопланет. Некоторые из них могут быть пригодны для проживания обезьян.",
                Ultraviolet : "Ультрафиолет",
                UltravioletText : "Электромагнитное излучение, которое может быть видимым и невидимым. Часто ультрафиолет исходит от Солнца. ",
                Gravity : "Гравитация ",
                GravityText : "Это сила, которая притягивает два тела друг к другу. Всё, к чему можно прикоснуться, имеет гравитационное притяжение.",
                Speedoflight : "Скорость света ",
                SpeedoflightText : "Скорость распространения электромагнитных волн и солнечного света. ",
                Turbulence : "Турбуленция",
                TurbulenceText : "Потоки воздуха, идущие вверх и вниз, в которые попадает космолёт, и его начинает трясти. ",
                Teleportation : "Телепортация",
                TeleportationText : "Перемещение тела или объекта или частиц из одного места в другое, обычно при помощи скачка. ",
                Observatory : "Обсерватория",
                ObservatoryText : "Здание, откуда наблюдают за различными объектами в космосе, обычно при помощи больших телескопов.",
                Constellation : "Созвездие ",
                ConstellationText: "Группа звёзд, которые представляют собой некий узор или изображение. Например, созвездие Ковш выглядит точно как ковшик с ручкой. ",
            });
            languative.modifyDictionary("en", {
                Title: "General",
                modalanguage: "Change Language",
                lc: "Your account",
                about: "About story",
                video: "Videobook",
                planets: "Planets",
                audiobook: "Audiobook",
                Rena: "Renanao",
                space: "SpaceWords",
                product: "Product",
                contact: "Contacts",
                general: "Main",
                aboutplanetsfromstory: "About planets from story",
                mercury: "Mercury",
                venus: "Venus",
                pluto: "Pluto",
                neptune: "Neptune",
                jupiter: "Jupiter",
                saturn: "Saturn",
                mars: "Mars",
                uran: "Uran",
                subscribe: "Subscribe",
                paymethod : "Pay for a subscription to see the next episodes",
                upload : "Upload more",
                language: "Language",
                menu : "Menu",
                UranText : "The cold planet which is covered with ice. The atmosphere temperature is - 224C, and winds sometimes blow at a speed of 250 meters per second. You can easily be blown off this planet. ",
                MarsText : "The planet is called 'Red Planet'. Dust storms take place quite often there. Scientists think one day some creatures might have lived on Mars. There are so many ideas and projects on terraforming of Mars (transforming the planet into Earth-like one). Maybe one day we will live on the Red Planet. Who knows? ",
                SaturnText : "Another gas giant. It has its own asteroid belt. It looks like hula hoop. The planet has 83 moons! There is liquid water there however, it consists of metan, which is not suitable for drinking.",
                JupiterText : "The biggest planet in our solar system. It is called 'The Gas Giant'. The planet has an enormous asteroid belt. Jupiter owns 80 natural satellites (moons); some of them are pretty wonderful, for example, Callisto and Io.",
                NeptuneText : "Another ice giant. The wind speed is 600 meters per second. Neptunus is four times bigger than Earth, and it is all blue.",
                PlutoText : "The furthest and one of the smallest planet in the solar system. It consists of ice and metal. It is cold in there. Much cold. Pluto is on the border of the solar system, and behind it -- the entire Milky Way. ",
                VenusText : "The hottest planet in our solar system. It is also the brightest one. Venus is named after the Goddess of Womanliness and Love. ",
                MercuryText : "The closest planet to the Sun. The year lasts there for only 88 days. The day may last the same time. There are so many craters there. Also, Mercury does not have different seasons of the year. It is always autumn there. ",



                Astronomy : "Astronomy",
                AstronomyText : "A natural science that studies the Universe, placement, structure and origin of space objects.",
                Universe : "Universe",
                UniverseText : "All the space in the sky that is visible and invisible to the eye. The Universe is versatile and infinite.",
                Galaxy : "Galaxy",
                GalaxyText : "A system of stars, stellar gas and dust, and planets.",
                Exoplanet : "Exoplanet",
                ExoplanetText : "A planet outside the solar system, in the system of another star. About 5000 exoplanets are known today. Some of them may be habitable for monkeys.",
                Ultraviolet : "Ultraviolet ",
                UltravioletText : "Electromagnetic radiation, which can be visible or invisible. Often ultraviolet comes from the Sun.",
                Gravity : "Gravity",
                GravityText : "It is the force that pulls two bodies towards each other. Everything that can be touched has a gravitational attraction.",
                Speedoflight : "Speed of light",
                SpeedoflightText : "The speed of spread of electromagnetic waves and sunlight.",
                Turbulence : "Turbulence",
                TurbulenceText : "Air flows going up and down, which the spacecraft gets into, and it starts to shake.",
                Teleportation : "Teleportation",
                TeleportationText : "The movement of a body or object or particles from one place to another, usually by means of a jump.",
                Observatory : "Observatory",
                ObservatoryText : "A building from which space objects are observed, usually with large telescopes.",
                Constellation : "Constellation (asterism)",
                ConstellationText: "A group of stars that represent a certain pattern or image. For example, the constellation Camelopardalis looks exactly like a camel.",
            });

            languative.modifyDictionary("es", {
               
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