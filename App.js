import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  TextInput,
  Modal,
  SafeAreaView,
} from "react-native";

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const url = "https://6528e7f6931d71583df28f2f.mockapi.io/api/tk";

  useEffect(() => {
    fetch(url)
      .then((resp) => resp.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
    console.log("vao day r");
  }, []);

  const addData = () => {
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: username.length++,
        name: name,
        usernames: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setData([...data, json]);
        setModalVisible(!modalVisible);
        setName("");
        setUsername("");
        setPassword("");
      })
      .catch((error) => console.error(error));
  };
  const deleteData = (id) => {
    fetch(`${url}/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setData(data.filter((item) => item.id !== id));
      })
      .catch((error) => console.error(error));
  };
   const startEditing = (id) => {
     const post = data.find((item) => item.id === id);
     setName(post.name);
     setUsername(post.usernames);
     setPassword(post.password);
     setCurrentId(id);
     setEditing(true);
     setModalVisible(true);
   };

   const editData = () => {
     fetch(`${url}/${currentId}`, {
       method: "PUT",
       headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         name: name,
         usernames: username,
         password: password,
       }),
     })
       .then((response) => response.json())
       .then((json) => {
         setData(data.map((item) => (item.id === currentId ? json : item)));
         setModalVisible(!modalVisible);
         setName("");
         setUsername("");
         setPassword("");
       })
       .catch((error) => console.error(error));
   };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={styles.txtmd}>Bảng Thông Tin Tài Khoản</Text>
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={{ ...styles.input, flex: 1 }}
                onChangeText={setName}
                value={name}
                placeholder="Nhập Name"
              />
              <TextInput
                style={{ ...styles.input, flex: 1 }}
                onChangeText={setUsername}
                value={username}
                placeholder="Nhập Username"
              />
              <TextInput
                style={{ ...styles.input, flex: 1 }}
                onChangeText={setPassword}
                value={password}
                placeholder="Nhập Password"
                secureTextEntry
              />
              <View style={{ flexDirection: "row" }}>
                <Button
                  title={editing ? "Sửa" : "Thêm"}
                  onPress={() => (editing ? editData() : addData())}
                />
                <Button
                  title="Đóng"
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    setName("");
                    setUsername("");
                    setPassword("");
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          data.map((post) => {
            return (
              <View style={styles.itemtk} key={post.id}>
                <View style={styles.item_tt}>
                  <Text style={styles.name}>{post.name}</Text>
                  <Text>{post.usernames}</Text>
                  <Text>{post.password}</Text>
                </View>
                <View style={styles.itembtn}>
                  <Button
                    title="X"
                    color="#ff0000"
                    onPress={() => deleteData(post.id)}
                  />
                  <Button
                    title="Sửa"
                    color="blue"
                    onPress={() => {
                      startEditing(post.id);
                      setModalVisible(true);
                    }}
                  />
                </View>
              </View>
            );
          })
        )}
        <View style={styles.buttonContainer}>
          <Button
            title="Thêm tk"
            color="black"
            onPress={() => {
              setEditing(false);
              setModalVisible(true);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  itemtk: {
    margin: 10,
    backgroundColor: "#C6E2FF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  item_tt: {
    flexDirection: "column",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  itembtn: {
    margin: 5,
    flexDirection: "row",
    alignSelf: "flex-end",
    alignSelf: "center",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 36,
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    height: 300,
    width: "100%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    backgroundColor: "#ecf0f1",
    width: "100%",
    padding: 10,
    margin: 5,
  },
  txtmd: {
    textAlign: "center",
    fontSize: 20,
  },
});
