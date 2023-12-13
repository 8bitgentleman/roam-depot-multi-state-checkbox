(ns multi-state-3
  (:require
   [reagent.core :as r]
   [datascript.core :as d]
   [roam.datascript.reactive :as dr]
   [roam.datascript :as rd]
   [blueprintjs.core :as bp]
   [roam.block :as block]
   [clojure.pprint :as pp]
   ))

; THIS CODEBLOCK IS OVERWRITTEN ON EVERY VERSION UPDATE
; DO NOT MODIFY

(defonce bp-button (r/adapt-react-class bp/Button))
(defonce bp-icon (r/adapt-react-class bp/Icon))

(defn get-block-string [uid]
  (:block/string (rd/pull 
      '[:block/string 
        ] 
      [:block/uid uid]))
)
(defn update-block-string [uid block-string]
  (block/update 
      {:block {:uid uid
               :string block-string}})
)

(defn cycle-tags [uid]
  (let [block-string (get-block-string uid)]
    )
  )

(defn cycle-state [uid]
  (let [states ["#[[TODO]]" "#[[DOING]]" "#[[BLOCKED]]" "#[[DONE]]" "#[[CANCELED]]"]
        block-string (get-block-string uid)
        current-state (first (filter #(re-find (re-pattern (str "#\\[\\[" % "\\]\\](?=( |$))")) block-string) states))
        current-index (if current-state (clojure.string/index-of states current-state) -1)
        next-state (states (mod (inc current-index) (count states)))]
    (update-block-string uid (clojure.string/replace block-string (str "#[[" current-state "]]") (str "#[[" next-state "]]")))))

(defn get-button-style [state]
  (let [base-style {:small true :className "multi-state-checkbox" :style {:minWidth "12px", :minHeight "12px" :width "16px" :height "16px" :outline "none"}}]
    (merge base-style
           (case state
             "TODO" {:icon (r/as-element [bp-icon {:icon "blank"}]) :intent "none" :outlined true }
             "DOING" {:icon (r/as-element [bp-icon {:icon "arrow-right"}]) :intent "warning"}
             "BLOCKED" {:icon (r/as-element [bp-icon {:icon "pause"}]) :intent "danger"}
             "DONE" {:icon (r/as-element [bp-icon {:icon "small-tick"}]) :intent "primary"}
             "CANCELED" {:icon (r/as-element [bp-icon {:icon "small-cross" :color "white"}]) :intent "none" :style {:backgroundColor "gray", :minWidth "12px", :minHeight "12px", :width "16px", :height "16px", :outline "none"} :outlined true}))))

(defn task-button [uid]
  (fn []
    (let [block-string (get-block-string uid)
          state (first (filter #(re-find (re-pattern (str "#\\[\\[" % "\\]\\](?=( |$))")) block-string) ["TODO" "DOING" "BLOCKED" "DONE" "CANCELED"]))
          style (get-button-style state)]
      [bp-button
       (merge style {:on-click (fn [] (cycle-state uid))})])))

(defn main [{:keys [block-uid]} & args]
  (fn []
    [task-button block-uid]))
