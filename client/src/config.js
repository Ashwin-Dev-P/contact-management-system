export function config() {

    var config_json = {

        "EXPRESS_JS_SERVER_URL": "",


        "THEME_COLORS": {

            "PRIMARY": "#007bff",

            "SECONDARY": "#fc3"

        },


        contact_us: {
            "email": [
                ""
            ],
            "whatsapp": [
                {
                    "number": 8056150426,
                    "country_code": 91,
                    "_id": "61843f15e479f47e9eb2dee0"
                }
            ]
        },

        follow_us: [
            {
                "link_name": "",
                "link_url": "",
                "_id": "61843f15e479f47e9eb2dedf"
            }
        ],


    }

    if (process.env.NODE_ENV === 'production') {
        config_json.EXPRESS_JS_SERVER_URL = ""
        return config_json;
    }
    else if (process.env.NODE_ENV === 'development') {
        config_json.EXPRESS_JS_SERVER_URL = "http://localhost:5000"
        return config_json;
    }

}

