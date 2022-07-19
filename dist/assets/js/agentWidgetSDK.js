lpTag.agentSDK.init();

var pathToData = "authenticatedData.customerDetails";
const addToCart = "Add to cart";
const springBouquet = "Spring bouquet";
var abcuid;

var notifyWhenDone = function (err) {
  if (err) {
    // Do something with the error
    console.log(err);
  }
  // called when the command is completed successfully,
  // or when the action terminated with an error.
};

var updateCallback = function (data) {
  // Do something with the returning data
  var value = data.newValue;
  abcuid = value.customerId;
  console.log('ABC data' , data)
  document.getElementById("appleId").innerHTML = "Apple Id: " + abcuid;
  // called each time the value is updated.
  // If there's an existing value when bind is called - this callback
  // will be called with the existing value
};
lpTag.agentSDK.bind(pathToData, updateCallback, notifyWhenDone);

var getOpaqueID = function (){
  return abcuid;
};

var sendMessageExtension = function (bid) {

  var cmdName = lpTag.agentSDK.cmdNames.writeSC; // = "Write StructuredContent"

  // See the metadata template here: https://developers.liveperson.com/apple-business-chat-templates-custom-interactive-message-template.html#metadata-template

  // The App Store identifier of your custom Messages framework extension
  // This is used if the customer does not have your app installed
  //var appId = 1234;

  var appId = 628448039;

  // The name of your custom Messages framework extension.
  var appName = "ParnasseMessagesExtensionPreprod";
  // The name of the Messages framework extension that the customer interacts with while using Messages.
  // It is composed along with the extension bundleID (com.liveperson.ABCDemoOmer.ABCDemoOmerMessageExtension), and teamID (YD9E38LGAJ)
  // Please change these to your appropriate values
  //var bid = "com.apple.messages.MSMessageExtensionBalloonPlugin:YD9E38LGAJ:com.liveperson.ABCDemoOmer.ABCDemoOmerMessageExtension";
  //var bid = "com.apple.messages.MSMessageExtensionBalloonPlugin:FJ97RXH3UH:com.bemobee.dev.parnasse"
  //var bid = "com.apple.messages.MSMessageExtensionBalloonPlugin:FJ97RXH3UH:com.bemobee.dev.parnasse.ParnasseMessagesExtensionPreprod";
//var bid = "com.apple.messages.MSMessageExtensionBalloonPlugin:FJ97RXH3UH:com.bemobee.dev.parnasse.ParnasseMessagesExtensionPreprod";
 //var bid = "com.apple.messages.MSMessageExtensionBalloonPlugin:3X5C5YGPN7:com.bemobee.dev.parnasse.ParnasseMessagesExtensionPreprod";
 //var bid = "com.apple.messages.MSMessageExtensionBalloonPlugin:KA74P8F4G2:com.bemobee.dev.parnasse.ParnasseMessagesExtensionPreprod";
 //var bid = "com.apple.messages.MSMessageExtensionBalloonPlugin:3X5C5YGPN7:com.bemobee.dev.parnasse.ParnasseMessagesExtensionPreprod";
 //var bid = "com.apple.messages.MSMessageExtensionBalloonPlugin:KA74P8F4G2:com.bemobee.dev.parnasse.ParnasseMessagesExtensionPreprod";
  // 	Image to be placed in the iMessage app bubble layout. Will be presented when LiveLayout
  //is disabled or when consumer does not have your app installed on iPhone / latest version is not updated with iMessage app / extension (Needs to be whitelisted on LP side)
  //var imageURL = "https://cdn-images-1.medium.com/max/1600/1*JY-JZfN8GW_OsJoVrI7wBg.png";
  var imageURL = "https://www.parnasse.fr/img/abc/icone%20authentification.jpg";
  // The URL to the data that is sent to the Messages framework extension. Should be sent encoded
  // The abcuid variable is set in the updateCallback after the authenticatedData.customerDetails SDE is changed (binded to this data in the public model as above).
  var URL = "?abcuid=" + abcuid;

  var data = {
    "json":
    {
      "type": "vertical",
      "elements": []
    },
    "metadata": [
      {
        "type": "BusinessChatCustomMessage",
        "appId": appId,
        "appName": appName,
        "bid": bid,
        "sessionIdentifier": "",
        "useLiveLayout": false,
        "receivedMessage": {
          "imageURL": imageURL,
          "title": "Appuyez pour vous authentifier",
          "style": "icon",
          "subtitle": "",
          "secondarySubtitle": "",
          "tertiarySubtitle": "",
          "imageTitle": "",
          "imageSubtitle": ""
        },
        "URL": URL
      }
    ]
  };
	console.log(URL);
  lpTag.agentSDK.command(cmdName, data, notifyWhenDone);
  return abcuid;
};


var sendListPicker = function () {

  var cmdName = lpTag.agentSDK.cmdNames.writeSC; // = "Write StructuredContent"

  // See the metadata template here: https://developers.liveperson.com/apple-business-chat-templates-list-picker-template.html

  var data = {
    "json":
    {
      "type": "vertical",
      "tag": "list",
      "elements": [
        {
          "type": "vertical",
          "elements": [
            {
              "type": "text",
              "text": "Flowers",
              "tooltip": "text tooltip",
              "style": {
                "bold": true,
                "size": "large"
              }
            },
            {
              "type": "horizontal",
              "elements": [
                {
                  "type": "image",
                  "url": "https://i.pinimg.com/736x/60/38/93/603893c655392b2c623a516f0a8c014c--wildflower-bouquet-dahlia-bouquet.jpg",
                  "tooltip": "Spring flowers"
                },
                {
                  "type": "vertical",
                  "elements": [
                    {
                      "type": "text",
                      "tag": "title",
                      "text": springBouquet,
                      "tooltip": springBouquet,
                      "style": {
                        "bold": true,
                        "size": "large"
                      }
                    },
                    {
                      "type": "text",
                      "tag": "subtitle",
                      "text": "Wild flowers",
                      "tooltip": "Wild flowers"
                    },
                    {
                      "type": "button",
                      "tooltip": addToCart,
                      "title": addToCart,
                      "click": {
                        "actions": [
                          {
                            "type": "publishText",
                            "text": springBouquet
                          }
                        ],
                        "metadata": [
                          {
                            "type": "ExternalId",
                            "id": springBouquet
                          }
                        ]
                      }
                    }
                  ]
                }
              ]
            },
            {
              "type": "horizontal",
              "elements": [
                {
                  "type": "image",
                  "url": "https://lynnefloralart.co.uk/wp-content/uploads/2018/06/Ella-Hand-Tied-Final.jpg",
                  "tooltip": "Spring flowers"
                },
                {
                  "type": "vertical",
                  "elements": [
                    {
                      "type": "text",
                      "tag": "title",
                      "text": "Bday flowers",
                      "tooltip": "Bday flowers",
                      "style": {
                        "bold": true,
                        "size": "large"
                      }
                    },
                    {
                      "type": "text",
                      "tag": "subtitle",
                      "text": "Mix flowers",
                      "tooltip": "Mix flowers"
                    },
                    {
                      "type": "button",
                      "tooltip": addToCart,
                      "title": addToCart,
                      "click": {
                        "actions": [
                          {
                            "type": "publishText",
                            "text": "published text button tap"
                          }
                        ]
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    "metadata": [
      {
        "type": "BusinessChatMessage",
        "multipleSelection": [true, false],
        "receivedMessage": {
          "style": "icon",
          "subtitle": "Select your favorite",
          "title": "Beautiful flowers",
          "secondarySubtitle": "secondary subtitle",
          "tertiarySubtitle": "tertiarySubtitle",
          "imageURL": "https://i.pinimg.com/736x/a0/67/5e/a0675e5161d7ae5be2550987f397a641--flower-shops-paper-flowers.jpg"
        },
        "replyMessage": {
          "style": "large",
          "subtitle": "",
          "title": "Your selection",
          "secondarySubtitle": "secondarySubtitle",
          "tertiarySubtitle": "tertiarySubtitle",
          "imageURL": "https://i.pinimg.com/736x/a0/67/5e/a0675e5161d7ae5be2550987f397a641--flower-shops-paper-flowers.jpg"
        }
      }
    ]
  };

  lpTag.agentSDK.command(cmdName, data, notifyWhenDone);
};
