const request = require('supertest');
const express = require('express');
const app= require("../server");
const mongoose= require("mongoose")


describe("Expense Tracker API", () => {
  // Test 1: Signup route
  it("should sign up a new user", async () => {
    const res = await request(app)
      .post("/signup")
      .send({
        name: "Test User",
        username: "testuser1",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // Test 2: Login route
  it("should log in user", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        username: "testuser1",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  // Test 3: Divider route
  it("should divide expense correctly", async () => {
  const res = await request(app)
    .post("/divider")
    .send({
      amount: 1000,
      tip: 100,
      member: 5,
    });

  expect(res.statusCode).toBe(200);
  expect(res.body.amountShare).toBe(200); 
  expect(res.body.tipShare).toBe(20);     
});
});


