"use client"
import React from "react";

const NewsLetter = () => {
  return (
    <div>
      <div className="hero w-full bg-gradient-to-br from-black via-teal-700 to-black py-12 sm:py-20 px-4">
        <div className="hero-content flex-col lg:flex-row">
          <div className="text-center lg:text-left text-white">
            <h1 className="text-5xl font-bold text-teal-300">Stay Updated with Ark!</h1>
            <p className="py-6">
              Be the first to know about the latest features, updates, and news
              from Ark. Our newsletter is packed with valuable insights, tips,
              and announcements to help you make the most out of your Para
              Autonomous Organization (PAO)
            </p>
          </div>
          <div className="card bg-white bg-opacity-10 backdrop-blur-lg w-full max-w-sm shrink-0 shadow-2xl">
            <form className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter Your Email Address"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary bg-clightTeal hover:bg-cteal border-none text-white">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
