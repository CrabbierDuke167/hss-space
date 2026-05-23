import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase-client";
import "../styles/subjects.css";

import {
  Orbit,
  FlaskConical,
  FunctionSquare,
  PenSquare,
  Binary,
  LoaderCircle
} from "lucide-react";

export const Subjects = () => {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const iconMap = {
    PHYSICS: <Orbit size={28} />,
    CHEMISTRY: <FlaskConical size={28} />,
    MATHEMATICS: <FunctionSquare size={28} />,
    ENGLISH: <PenSquare size={28} />,
    COMPUTER: <Binary size={28} />
  };

  const glazeMap = {
    PHYSICS: "DYNAMIC",
    CHEMISTRY: "REACTIVE",
    MATHEMATICS: "ABSTRACT",
    ENGLISH: "THOUGHTFUL",
    COMPUTER: "EFFICIENT"
  };

  useEffect(() => {
    let mounted = true;

    const loadSubjects = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("subjects")
          .select("id,name")
          .order("id");

        if (error) throw error;

        const formatted =
          data?.map((subject) => {

            const displayName =
              subject?.name === "COMPUTER SCIENCE"
                ? "COMPUTER"
                : subject?.name;

            return {
              ...subject,

              displayName,

              glaze:
                glazeMap?.[displayName] ||
                "GENERAL",

              icon:
                iconMap?.[displayName] ||
                <Binary size={28}/>
            };
          }) || [];

        if (mounted) {
          setSubjects(formatted);
        }

      } catch (err) {

        console.error(
          "Failed loading subjects:",
          err
        );

        setSubjects([]);

      } finally {

        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSubjects();

    return () => {
      mounted = false;
    };

  }, []);

  const handleCardClick = (subjectName) => {
    navigate("/resource", {
      state: {
        selectedSubject: subjectName
      }
    });
  };

  if (loading) {
    return (
      <div className="subjects-wrapper">
        <div className="subjects-loading">

          <LoaderCircle
            size={30}
            className="spin"
          />

          <p>
            LOADING SUBJECT MATRIX...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="subjects-wrapper">

      <div className="subjects-div">

        {subjects?.length ? (

          subjects.map((subject) => (

            <div
              className="subject-card"
              key={subject?.id}
              onClick={() =>
                handleCardClick(
                  subject?.displayName
                )
              }
            >


              <div className="subject-icon">
                {subject?.icon}
              </div>

              <div className="subject-glaze">
                {subject?.glaze}
              </div>

              <h3 className="subject-name">
                {subject?.displayName}
              </h3>

            </div>

          ))

        ) : (

          <div className="empty-subjects">

            <h2>
              NO SUBJECTS FOUND
            </h2>

            <p>
              Database returned nothing
            </p>

          </div>

        )}

      </div>

      <div className="subject-palette">

        <p className="palette-heading">
          [SUBJECT GRID:
          TERRACOTTA_ACCENT,
          DITHERED,
          BITMAP.MASK]
        </p>

        <div className="palette-dots">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

      </div>

    </div>
  );
};


// no wthe final tackle, dashboard, howwwww





// use only our index css colcor n things and vibe - it should be most attracttive part of the site



// like a heading YOUR PROGRESS and our teeny deco r [cool text ] lol

// thean sid eof teh heading a glow n fade kinda css dot saying live data and data next to side



// for features:



// first well aranged gapped grids or flex idk with 

// [QUESTION DONE (a cute icon very small btw)  546  then liek an arrow up 94 thsi week]



// then samee ething but for [STUDY STREAK 12 DAYS then personal best:]

// [TIME INVESTED 68h this month] all them ahve teh cute icon in them lol ay be add one more grid to make em 4





// then a bar graph [WEEK LY ACTIVITY]



// then 

// [ACCURACY RADAR] BY SUBJECT pie chart





// then

// [SUBJECT PROGRESS] 

// COMPLETEION RATE

// icon math 10/30 Q and a synced progress bard 

// every subject



// [RECENT ACTIVITY]

// SESION LOG

// balh balh activities



// WEEK ACCURACY = a progress bar of %