export const SAMPLE_PRESETS = [
  {
    id: 'python-security-sql',
    name: 'Python Flask API (Security & SQL Injection)',
    language: 'python',
    icon: '🐍',
    description: 'Contains OWASP Top 10 SQL Injection, hardcoded JWT secrets, and missing input validation.',
    code: `import sqlite3
import jwt
from flask import Flask, request, jsonify

app = Flask(__name__)
SECRET_KEY = "super_secret_jwt_key_12345!" # Hardcoded API Secret!

@app.route('/user/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    
    # DANGER: SQL Injection vulnerability!
    query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'"
    
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute(query) # Unsafe execution!
    user = cursor.fetchone()
    
    if user:
        # Generates JWT without expiration
        token = jwt.encode({"user_id": user[0], "role": user[3]}, SECRET_KEY, algorithm="HS256")
        return jsonify({"status": "success", "token": token})
    else:
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401

@app.route('/debug/eval', methods=['GET'])
def debug_code():
    code = request.args.get('cmd')
    # CRITICAL: Remote Code Execution vulnerability!
    result = eval(code)
    return str(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)`
  },
  {
    id: 'nodejs-async-memory',
    name: 'Node.js Express (Async Leak & Performance)',
    language: 'javascript',
    icon: '🟨',
    description: 'Includes unhandled promise rejections, blocking O(n^2) operations, and memory listener leaks.',
    code: `const express = require('express');
const EventEmitter = require('events');
const app = express();
const eventBus = new EventEmitter();

let globalCache = []; // Memory leak: unbounded array expansion

app.use(express.json());

// Inefficient blocking O(n^2) endpoint
app.post('/process-items', async (req, res) => {
  const items = req.body.items || [];
  
  // Unhandled async promise rejection risk
  fetchExternalAnalytics(req.body.userId);
  
  const duplicateMatrix = [];
  // O(n^2) nested loop blocking the event loop
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items.length; j++) {
      if (i !== j && items[i].id === items[j].id) {
        duplicateMatrix.push([items[i], items[j]]);
      }
    }
  }

  // Memory Leak: Adding event listener on every HTTP request!
  eventBus.on('dataProcessed', (data) => {
    globalCache.push(data);
    console.log("Processed item", data);
  });
  
  eventBus.emit('dataProcessed', { time: Date.now(), count: items.length });

  res.json({ status: 'done', duplicates: duplicateMatrix.length });
});

async function fetchExternalAnalytics(userId) {
  // Missing try/catch block!
  const response = await fetch('https://analytics.internal/api/v1/user/' + userId);
  return await response.json();
}

app.listen(3000, () => console.log('Server listening on port 3000'));`
  },
  {
    id: 'react-performance-bug',
    name: 'React Frontend (State Bug & Re-render Loop)',
    language: 'javascript',
    icon: '⚛️',
    description: 'React component with missing useEffect dependencies, array mutations, and missing keys.',
    code: `import React, { useState, useEffect } from 'react';

export function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([
    { id: 1, name: 'Project Alpha', status: 'Active' },
    { id: 2, name: 'Project Beta', status: 'Pending' }
  ]);

  // BUG: Missing userId dependency causes stale data & warnings!
  useEffect(() => {
    fetch('/api/user/' + userId)
      .then(res => res.json())
      .then(data => setUser(data));
  }, []); // Empty array instead of [userId]

  const handleAddItem = (newItemName) => {
    // BUG: Direct state mutation instead of immutable state update!
    items.push({ id: Math.random(), name: newItemName, status: 'Active' });
    setItems(items); // React won't re-render properly!
  };

  // Performance flaw: Filtering large array without useMemo on every render
  const filteredItems = items.filter(item => {
    console.log("Filtering items..."); // Expensive recalculation!
    return item.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="dashboard">
      <h2>Welcome, {user == null ? 'Guest' : user.name}</h2>
      <input 
        type="text" 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
        placeholder="Search projects..." 
      />
      <ul>
        {filteredItems.map(item => (
          // BUG: Using array index or non-unique Math.random() as key
          <li key={item.name}>
            <span>{item.name}</span> - <strong>{item.status}</strong>
          </li>
        ))}
      </ul>
      <button onClick={() => handleAddItem('New Task')}>Add Item</button>
    </div>
  );
}`
  },
  {
    id: 'cpp-java-memory-leak',
    name: 'Java / C++ (Null Safety & Resource Leak)',
    language: 'java',
    icon: '☕',
    description: 'Java method with missing try-with-resources, NullPointer risks, and improper string comparison.',
    code: `package com.app.service;

import java.io.*;
import java.util.*;

public class ReportGenerator {

    private String outputDirectory = "/tmp/reports/";

    public void generateReport(String fileName, List<String> data) {
        // Potential NullPointerException: data is not checked for null!
        if (data.size() == 0) {
            System.out.println("No data provided");
            return;
        }

        File file = new File(outputDirectory + fileName);
        
        try {
            // RESOURCE LEAK: FileWriter and BufferedWriter not closed in finally block or try-with-resources!
            FileWriter fw = new FileWriter(file);
            BufferedWriter bw = new BufferedWriter(fw);
            
            for (int i = 0; i <= data.size(); i++) { // BUG: IndexOutOfBoundsException (i <= size instead of < size)
                bw.write(data.get(i));
                bw.newLine();
            }
            bw.flush();
        } catch (IOException e) {
            e.printStackTrace(); // Bad practice: empty/generic error logging
        }
    }

    public boolean checkPermission(String userRole) {
        // BUG: String comparison using '==' instead of '.equals()'!
        if (userRole == "ADMIN") {
            return true;
        }
        return false;
    }
}`
  },
  {
    id: 'clean-code-sample',
    name: 'TypeScript Production (Clean & Solid)',
    language: 'typescript',
    icon: '✨',
    description: 'High quality clean code sample following SOLID, immutability, proper error handling, and type safety.',
    code: `/**
 * Service for securely processing user payment transactions.
 */

export interface TransactionRequest {
  readonly id: string;
  readonly amount: number;
  readonly currency: string;
  readonly userId: string;
}

export interface TransactionResult {
  readonly success: boolean;
  readonly transactionId: string;
  readonly timestamp: number;
}

export class PaymentProcessor {
  private readonly maxTransactionLimit: number;

  constructor(maxTransactionLimit = 10_000) {
    this.maxTransactionLimit = maxTransactionLimit;
  }

  /**
   * Validates and processes a financial transaction.
   * @throws {Error} If transaction amount exceeds valid limit or parameters are invalid.
   */
  public async processTransaction(request: TransactionRequest): Promise<TransactionResult> {
    this.validateRequest(request);

    try {
      const confirmationId = await this.executePaymentGateway(request);

      return Object.freeze({
        success: true,
        transactionId: confirmationId,
        timestamp: Date.now(),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown payment failure';
      console.error(\`[PaymentProcessor] Payment failed for user \${request.userId}:\`, errorMessage);
      throw new Error(\`Payment processing failed: \${errorMessage}\`);
    }
  }

  private validateRequest(request: TransactionRequest): void {
    if (!request.id || typeof request.id !== 'string') {
      throw new Error('Invalid transaction ID');
    }
    if (typeof request.amount !== 'number' || request.amount <= 0) {
      throw new Error('Transaction amount must be a positive number');
    }
    if (request.amount > this.maxTransactionLimit) {
      throw new Error(\`Transaction amount exceeds maximum limit of \${this.maxTransactionLimit}\`);
    }
  }

  private async executePaymentGateway(request: TransactionRequest): Promise<string> {
    // Simulated external secure gateway call
    return \`tx_\${request.id}_\${Date.now()}\`;
  }
}`
  }
];
