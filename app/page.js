"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDoc,
  querySnapshot,
  query,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Button } from "@mui/material";

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", quantity: "" });
  const [total, setTotal] = useState(0);
  const [editingItem, setEditingItem] = useState(null);
  const [search, setSearch] = useState("");

  // Add item to database
  const addItem = async (e) => {
    e.preventDefault();
    if (
      newItem.name !== "" &&
      newItem.price !== "" &&
      newItem.quantity !== ""
    ) {
      if (editingItem) {
        const itemRef = doc(db, "items", editingItem.id);
        await updateDoc(itemRef, {
          name: newItem.name.trim(),
          price: newItem.price,
          quantity: newItem.quantity,
        });
        setEditingItem(null);
      } else {
        await addDoc(collection(db, "items"), {
          name: newItem.name.trim(),
          price: newItem.price,
          quantity: newItem.quantity,
        });
      }
      setNewItem({ name: "", price: "", quantity: "" });
    }
  };

  // Read items from database
  useEffect(() => {
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      const filteredItems = itemsArr.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      setItems(filteredItems);

      const calculateTotal = () => {
        const totalPrice = filteredItems.reduce(
          (sum, item) => sum + parseFloat(item.price) * parseInt(item.quantity),
          0
        );
        setTotal(totalPrice);
      };
      calculateTotal();
    });
    return () => unsubscribe();
  }, [search]);

  // Edit items from database
  const startEditing = (item) => {
    setEditingItem(item);
    setNewItem({ name: item.name, price: item.price, quantity: item.quantity });
  };

  // Delete items from database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "items", id));
  };

  return (
    <main
      style={{
        backgroundImage:
          'url("https://www.thespruce.com/thmb/klPQy_QIpRVaN3WZb9ZTjJ85eys=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1453229786-90547add346b45cab3c90dd0c518c5d4.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="flex min-h-screen flex-col items-center justify-between sm: p-14 p-0"
    >
      <div className="inline-block bg-gradient-to-r z-10 max-w-5xl w-full items-center justify-between font-mono text-sm from-green-500 to-purple-500 text-white p-2 rounded-lg">
        <h1 className="text-4xl p-4 text-center">Pantry Tracker</h1>
        <p className="text-center text-lg text-white">
          Keep track of your pantry items with ease. Add, edit, delete, and
          search for items as needed, and see your total value updated in
          real-time.
        </p>
        <div className="bg-slate-800 p-4 rounded-lg">
          <form className="grid grid-cols-6 items-center text-black">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="col-span-6 mb-4 p-3 border"
              type="text"
              placeholder="Search for an Item"
            />
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="col-span-3 p-3 border"
              type="text"
              placeholder="Enter Item"
            />
            <input
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              className="col-span-1 p-3 border"
              type="number"
              placeholder="Enter $"
            />
            <input
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
              className="col-span-1 p-3 border"
              type="number"
              placeholder="Enter Quantity"
            />
            <Button
              onClick={addItem}
              className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl"
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{
                backgroundColor: "#696969",
                color: "white",
                marginLeft: "5px",
              }}
            >
              +
            </Button>
          </form>
          <ul>
            {items.map((item, id) => (
              <li
                key={id}
                className="my-4 w-full flex justify-between bg-slate-950"
              >
                <div className="p-4 w-full flex justify-between">
                  <span className="capitalize">{item.name}</span>
                  <span className="capitalize">${item.price}</span>
                </div>
                <div className="flex">
                  <button className="p-4 border-l-2 border-slate-900  w-18 flex items-center">
                    <span className="mr-1">Qty:</span>
                    <span>{item.quantity}</span>
                  </button>
                  <button
                    onClick={() => startEditing(item)}
                    className="p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16"
                  >
                    X
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {items.length < 1 ? (
            ""
          ) : (
            <div className="flex justify-between p-3">
              <span>Total:</span>
              <span>${total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
