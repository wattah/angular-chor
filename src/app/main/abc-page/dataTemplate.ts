export let DataSendMessageExtension = {
    json: {
      type: 'vertical',
      elements: []
    },
    metadata: [
      {
        type: 'BusinessChatCustomMessage',
        appId: 0,
        appName: '',
        bid: '',
        sessionIdentifier: '',
        useLiveLayout: false,
        receivedMessage: {
          imageURL: '',
          title: 'Tap to Authenticate',
          style: 'icon',
          subtitle: '',
          secondarySubtitle: '',
          tertiarySubtitle: '',
          imageTitle: '',
          imageSubtitle: ''
        },
        URL: ''
      }
    ]
  };

export let dataSendListPicker = {
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
                      "text": "Spring bouquet",
                      "tooltip": "Spring bouquet",
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
                      "tooltip": "Add to cart",
                      "title": "Add to cart",
                      "click": {
                        "actions": [
                          {
                            "type": "publishText",
                            "text": "Spring bouquet"
                          }
                        ],
                        "metadata": [
                          {
                            "type": "ExternalId",
                            "id": "Spring bouquet"
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
                      "tooltip": "Add to cart",
                      "title": "Add to cart",
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

export const consumerData = {
  avatarUrl: '',
  backgndImgUri: '',
  email: '',
  firstName: '',
  lastName: '',
  phone: ''
};
