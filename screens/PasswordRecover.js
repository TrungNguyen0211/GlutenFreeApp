import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { validateAll } from "indicative/validator";
import firebase from "firebase";

/**Class PasswordRecover responsible to offer functionalities
 * to the users to recover their password. in case the user
 * does not remember.
 */
export class PasswordRecover extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      error: {},
    };

    this.onSignUp = this.onSignUp.bind(this);
  }
  // Validate function to recover password which
  // require an email from the user
  validate = async (data) => {
    const rules = {
      email: "required|email",
    };

    const message = {
      "email.required": "Email cannot be empty",
    };
    try {
      await validateAll(data, rules, message).then(() => this.onSignUp());
    } catch (errors) {
      const formattedErrors = {};
      console.log("=====", errors.response);

      if (errors.response && errors.response.status === 422) {
        formattedErrors["email"] = errors.response.data["email"][0];
        this.setState({
          error: formattedErrors,
        });
      } else {
        errors.forEach(
          (error) => (formattedErrors[error.field] = error.message)
        );

        this.setState({
          error: formattedErrors,
        });
      }
    }
  };

  // function to sign up and recover password 
  // by authentificate the email
  onSignUp() {
    const { email } = this.state;
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then((result) => {
        alert("Password Recovery Email Sent");
        console.log(result);
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          alert("The email has not been registered");
        }

        if (error.code === "auth/invalid-email") {
          alert("Enter a valid email");
        }
        console.log(error);
      });
  }

  // render is a function that tell what to display
  // on the PasswordRecover screen. every component will 
  // have a title to describe them.
  render() {
    return (
      <ImageBackground
        source={require("../assets/gluten-free-background.jpg")}
        style={styles.backgroundImage}
      >
        <View style={styles.screenContainer}>
          <View style={styles.textBoxView}>
            {/* textbox for entering register email */}
            <TextInput
              style={styles.textBox}
              placeholder="Enter Registered Email"
              onChangeText={(email) => this.setState({ email })}
            />
          </View>
          <View style={styles.space} />
          <View style={styles.buttons}>
            <TouchableOpacity onPress={() => this.validate()}>
              <Text style={styles.textElement}>Send Recovery Email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

// Styling for screen
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingTop: 200,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  buttons: {
    backgroundColor: "lightgrey",
    fontSize: 200,
    height: 50,
    width: 260,
  },
  space: {
    width: 20,
    height: 10,
  },
  textBoxView: {
    flexDirection: "row",
    marginBottom: 20,
  },
  textBox: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginHorizontal: 30,
    backgroundColor: "white",
    shadowColor: "#000",
    flex: 1,
    borderWidth: 1,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  textElement: {
    fontSize: 25,
    marginTop: 8,
    textAlign: "center",
    color: "black",
  },
});
export default PasswordRecover;
