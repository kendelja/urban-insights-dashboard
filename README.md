Urban Insights Dashboard
------------------------
Overview
--------

Urban Insights Dashboard is an end-to-end, data-driven web application that analyzes and visualizes urban safety and affordability metrics at the neighbourhood level.

The application processes real-world datasets (crime statistics, population, and rent data) and presents them through an interactive map of Toronto. Each neighbourhood is color-coded based on a derived safety score and displays average rent, allowing users to quickly explore and compare areas.

This project is designed to demonstrate full-stack development, data engineering, geospatial visualization, and applied analytics using a modern, production-style architecture.

Tech Stack
----------
Backend
- Python
- FastAPI
- Pandas
- Scikit-learn (planned / optional modeling)
- GeoJSON processing
  
Frontend
- JavaScript
- React
- Vite
- Leaflet (interactive maps)

Data & Infrastructure
- CSV datasets (crime, population, rent)
- REST API architecture
- Git & GitHub
- Cloud deployment (planned)

Key Features
- Interactive map of Toronto neighbourhoods using geospatial boundaries
- Crime data cleaning, aggregation, and normalization
- Derived neighbourhood safety score based on multiple crime categories
- Color-coded choropleth map for intuitive risk visualization
- API-driven architecture separating data processing from UI
- Scalable design to support additional cities and datasets

Architecture Overview

Data Processing Layer (Python)

Ingests raw CSV datasets

Cleans and normalizes data

Computes derived metrics (crime score, safety rating)

Merges analytical data with GeoJSON boundaries

API Layer (FastAPI)

Exposes processed neighbourhood data via REST endpoints

Serves JSON optimized for frontend rendering

Designed to support future ML predictions and analytics

Frontend Layer (React + Leaflet)

Fetches neighbourhood data from backend API

Renders interactive map and visual layers

Displays neighbourhood-level insights via tooltips and filters

Project Goals

Build a resume-quality, production-style application

Demonstrate end-to-end ownership: data → backend → frontend → deployment

Apply AI-adjacent skills (feature engineering, scoring models, analytics)

Create a flexible platform that can extend beyond Toronto to other cities

Current Status

Data ingestion and preprocessing implemented

Crime scoring logic completed

GeoJSON-based neighbourhood mapping integrated

React + Leaflet frontend in progress

Backend API endpoints in development

Planned Enhancements

Rent affordability index integration

Machine learning model for neighbourhood risk prediction

Filters (crime type, time range, affordability)

Insights panel highlighting safest and most affordable areas

Full cloud deployment with live demo link

Why This Project

This project was built to explore how data engineering, analytics, and web technologies can be combined to solve real-world urban decision-making problems. It reflects how modern software engineers and data-focused developers build scalable, data-driven systems.
