"""
PolarNav AI - Vercel Serverless Function Entry Point

This module adapts the FastAPI `app` for use as a Vercel Python Serverless Function.
Vercel invokes this file via the ASGI interface using the `app` export.

All routes defined in backend/main.py are preserved as-is.
"""

import sys
import os

# Add backend directory to Python path so relative imports resolve correctly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from main import app  # noqa: F401  – Vercel expects an `app` ASGI callable

# Vercel's Python runtime discovers and serves `app` automatically.
# No additional handler wrapping is required.
